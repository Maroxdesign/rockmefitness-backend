import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrdersService } from './orders.service';
import {
  IActiveUsers,
  ICompleteOrder,
  IDriverAcceptOrder,
  IDriverRejectOrder,
  OrderStatus,
} from 'src/common/constants/order.constants';
import { DriverService } from '../driver/driver.service';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
import {
  DeliveryCompleted,
  HistoryTypeEnum,
  PendingPayment,
} from '../../../common/constants/history.constants';
import { HistoryService } from '../history/history.service';

dotenv.config();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrderGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers: IActiveUsers[] = [];

  constructor(
    private readonly orderService: OrdersService,
    private driverService: DriverService,
    private userService: UserService,
    private historyService: HistoryService,
  ) {}

  afterInit(server: any): any {
    console.log('socket initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected');
  }

  handleDisconnect(client: any) {
    this.activeUsers = this.activeUsers.filter(
      (user) => user.socketId !== client.id,
    );
  }

  @SubscribeMessage('userActive')
  async handleUserActive(client: any, data: any) {
    const { userId } = data;

    this.activeUsers.push({
      socketId: client.id,
      userId,
    });
  }

  @SubscribeMessage('completeOrder')
  async handleCompleteOrder(client: any, data: ICompleteOrder) {
    const { orderId } = data;

    const order = await this.orderService.getOrderById(orderId);

    if (order.driverId) {
      return;
    }

    let closestDrivers = await this.driverService.findNearbyDrivers(
      order.fromLatitude,
      order.fromLongitude,
    );

    closestDrivers = closestDrivers.filter(
      (driver) => !order.rejectedDriverIds.includes(driver._id),
    );

    if (closestDrivers.length <= 0) {
      return;
    }

    const driver = closestDrivers[0];
    const driverSocketId = this.getUserSocketId(driver._id);

    this.server.to(driverSocketId).emit('newOrder', order);
  }

  @SubscribeMessage('handleDriverRejectOrder')
  async handleDriverRejectedOrder(client: any, data: IDriverRejectOrder) {
    const { orderId, driverId } = data;

    const order = await this.orderService.getOrderById(orderId);

    if (order.rejectedDriverIds.includes(driverId)) {
      console.log('driver already rejected this order');
      return;
    }

    await this.orderService.updateOrder(orderId, {
      rejectedDriverIds: [...order.rejectedDriverIds, driverId],
    });

    await this.handleCompleteOrder(client, { orderId });
    client.emit('driverRejectedOrderSuccess');
  }

  @SubscribeMessage('handleDriverAcceptOrder')
  async handleDriverAcceptOrder(client: any, data: IDriverAcceptOrder) {
    const { driverId, orderId } = data;

    const driver = await this.userService.findById(driverId);
    const order = await this.orderService.getOrderById(orderId);

    await this.orderService.assignDriverToOrder(driverId, orderId);

    const eta = await this.orderService.calculateEta(
      driver.location.coordinates[0],
      driver.location.coordinates[1],
      order.fromLatitude,
      order.fromLongitude,
    );

    order.eta = eta;
    await this.orderService.updateOrder(orderId, {
      eta,
      orderStatus: OrderStatus.ACCEPTED,
    });

    client.emit('orderAssignedToDriver', order);
  }

  @SubscribeMessage('handleDriverArrived')
  async handleDriverArrived(client: any, data: any) {
    const { orderId } = data;
    const order = await this.orderService.getOrderById(orderId);

    const userSocketId = this.getUserSocketId(order.userId);

    this.server.to(userSocketId).emit('driverArrived', order);
  }

  @SubscribeMessage('handleDriverPickup')
  async handleDriverPickup(client: any, data: any) {
    const { orderId } = data;
    const order = await this.orderService.getOrderById(orderId);

    const userSocketId = this.getUserSocketId(order.userId);

    await this.orderService.updateOrder(orderId, {
      isPickedUp: true,
    });

    this.server.to(userSocketId).emit('driverPickup', order);
  }

  @SubscribeMessage('deliveryComplete')
  async handleDeliveryComplete(client: any, data: any) {
    const { orderId } = data;
    const order = await this.orderService.getOrderById(orderId);

    const userSocketId = this.getUserSocketId(order.userId);

    await this.orderService.updateOrder(orderId, {
      orderStatus: OrderStatus.COMPLETED,
    });

    // create history
    await this.historyService.createHistory(order.userId, {
      title: 'New Order',
      description: 'Drop-off Point',
      amount: order.orderAmount,
      type: HistoryTypeEnum.Order,
      status: DeliveryCompleted,
      fromLocation: order.pickupAddress,
      toLocation: order.destinationAddress,
      orderId: order._id,
    });

    this.server.to(userSocketId).emit('deliveryComplete', order);
  }

  getUserSocketId(userId: string) {
    userId = userId.toString();
    const user = this.activeUsers.find((user) => user.userId === userId);

    return user ? user.socketId : null;
  }
}
