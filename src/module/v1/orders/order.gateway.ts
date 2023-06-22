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
  ) {}

  afterInit(server: any): any {
    console.log('socket initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected');

    client.emit('message', 'Successfully connected to server');
  }

  handleDisconnect(client: any) {
    console.log('client disconnected');
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

    //todo: update;
    const eta = await this.orderService.calculateEta(
      closestDrivers[0].location.coordinates[0],
      closestDrivers[0].location.coordinates[1],
      order.fromLatitude,
      order.fromLongitude,
    );

    order.eta = eta;
    await this.orderService.updateOrder(orderId, {
      eta,
    });
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

    await this.orderService.assignDriverToOrder(driverId, orderId);

    client.emit('orderAssignedToDriver');
    console.log('handleDriverAcceptOrder', data);
  }
}
