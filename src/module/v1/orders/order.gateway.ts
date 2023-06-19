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
import { ICompleteOrder } from 'src/common/constants/order.constants';
import { DriverService } from '../driver/driver.service';

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

    const order = await this.orderService.getOrderById(orderId);

    const closestDrivers = await this.driverService.findNearbyDrivers(
      order.fromLatitude,
      order.fromLongitude,
    );

    console.log('closest-drivers', closestDrivers);

    console.log('completeOrder', data);
  }

  @SubscribeMessage('assignDriverToOrder')
  async handleAssignDriverToOrder(client: any, data: any) {
    console.log('assignDriverToOrder', data);
    const { driverId, orderId } = data;

    await this.orderService.assignDriverToOrder(driverId, orderId);

    client.emit('orderAssignedToDriver');
  }
}
