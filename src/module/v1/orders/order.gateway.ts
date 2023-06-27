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
  ICompleteOrder,
  IDriverAcceptOrder,
  IDriverRejectOrder,
} from 'src/common/constants/order.constants';
import { DriverService } from '../driver/driver.service';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
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

  constructor(
    private readonly orderService: OrdersService,
    private driverService: DriverService,
    private userServcie: UserService,
  ) {}

  afterInit(server: any): any {
    console.log('socket initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected', client);
  }

  handleDisconnect(client: any) {
    console.log('client disconnected', client);
  }

  @SubscribeMessage('completeOrder')
  async handleCompleteOrder(client: any, data: ICompleteOrder) {
    const { orderId } = data;

    let order = await this.orderService.getOrderById(orderId);

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
  }

  @SubscribeMessage('handleDriverRejectdOrder')
  async handleDriverRejectedOrder(client: any, data: IDriverRejectOrder) {
    const { orderId, driverId } = data;

    await this.orderService.updateOrder(orderId, {
      rejectedDriverIds: [driverId],
    });

    await this.handleCompleteOrder(client, { orderId });
    client.emit('driverRejectedOrderSuccess');
    console.log('handleDriverRejectedOrder', data);
  }

  @SubscribeMessage('handleDriverAcceptOrder')
  async handleDriverAcceptOrder(client: any, data: IDriverAcceptOrder) {
    const { driverId, orderId } = data;

    const driver = await this.userServcie.findById(driverId);
    const order = await this.orderService.getOrderById(orderId);

    await this.orderService.assignDriverToOrder(driverId, orderId);

    //todo: update;
    const eta = await this.orderService.calculateEta(
      driver.location.coordinates[0],
      driver.location.coordinates[1],
      order.fromLatitude,
      order.fromLongitude,
    );

    order.eta = eta;
    await this.orderService.updateOrder(orderId, {
      eta,
    });

    client.emit('orderAssignedToDriver', order);
    console.log('handleDriverAcceptOrder', data);
  }
}
