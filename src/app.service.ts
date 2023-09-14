import { Injectable } from '@nestjs/common';
import { UserService } from './module/v1/user/user.service';
import { OrdersService } from './module/v1/orders/orders.service';
import { CreateUserDto } from './module/v1/user/dto/create-user.dto';
import { RidesService } from './module/v1/rides/rides.service';
import { RoleEnum } from './common/constants/user.constants';
import { CreateOrderDto } from './module/v1/orders/dto/create-order.dto';
import {
  OrderStatus,
  PaymentStatus,
  PickupType,
} from './common/constants/order.constants';
import * as bcrypt from 'bcrypt';
import {
  DeliveryCompleted,
  HistoryTypeEnum,
} from './common/constants/history.constants';
import { HistoryService } from './module/v1/history/history.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private orderService: OrdersService,
    private rideService: RidesService,
    private historyService: HistoryService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async seed() {
    const userDatas = [
      {
        name: 'user1',
        email: 'user1@gmail.com',
        password: 'password1',
        firstName: 'name',
        lastName: 'name',
        phone: '088888888',
        role: RoleEnum.CUSTOMER,
      },
      {
        name: 'user2',
        email: 'user2@gmail.com',
        password: 'password2',
        firstName: 'name',
        lastName: 'name',
        phone: '088888889',
        role: RoleEnum.RIDER,
      },
      {
        name: 'user2',
        email: 'user3@gmail.com',
        password: 'password2',
        firstName: 'name',
        lastName: 'name',
        phone: '088888699',
        role: RoleEnum.RIDER,
      },
    ];

    // delete users that already exist
    for (const user of userDatas) {
      await this.userService.deleteUser(user.email);
    }

    const createdUsers = [];

    for (const userData of userDatas) {
      const dto = new CreateUserDto();
      Object.assign(dto, userData);

      const res = await this.userService.create({
        ...dto,
        password: await bcrypt.hash(userData.password, 12),
      });
      createdUsers.push(res);
    }

    // seed history for driver and user
    const driver = await this.userService.findUserByEmail('user3@gmail.com');
    const user = await this.userService.findUserByEmail('user1@gmail.com');

    if (!driver && !user) {
      return;
    }

    const rides = await this.rideService.getRides();

    let ride: any;

    if (!rides || rides.length <= 0) {
      ride = await this.rideService.createRide(
        {
          name: 'ride1',
          pricePerKilometer: '100',
        },
        null,
      );
    } else {
      ride = rides[0];
    }

    const orders = [
      {
        title: 'title1',
        description: 'description1',
        type: 'type1',
        status: 'status1',
        amount: 100,
        fromLocation: 'fromLocation1',
        toLocation: 'toLocation1',
        orderId: 'orderId1',
        userId: user._id,
        rideId: ride._id,
        driverId: driver._id,
        orderAmount: 100,
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PAID,
        isPickedUp: false,
        pickupAddress: 'pickupAddress1',
        destinationAddress: 'destinationAddress1',
        fromLongitude: 1,
        fromLatitude: 1,
        toLatitude: 1,
        toLongitude: 1,
        pickupType: PickupType.NOW,
        rideType: 'keke',
        packageType: 'food',
        recipientName: 'user',
        recipientPhone: '080000000',
      },
      {
        title: 'title2',
        description: 'description2',
        type: 'type2',
        status: 'status2',
        amount: 200,
        fromLocation: 'fromLocation2',
        toLocation: 'toLocation2',
        orderId: 'orderId2',
        userId: user._id,
        rideId: ride._id,
        driverId: driver._id,
        orderAmount: 100,
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PAID,
        isPickedUp: false,
        pickupAddress: 'pickupAddress1',
        destinationAddress: 'destinationAddress1',
        fromLongitude: 1,
        fromLatitude: 1,
        toLatitude: 1,
        toLongitude: 1,
        pickupType: PickupType.NOW,
        rideType: 'keke',
        packageType: 'food',
        recipientName: 'user',
        recipientPhone: '080000000',
      },
    ];
    const createdOrders = [];

    for (const order of orders) {
      const dto = new CreateOrderDto();
      Object.assign(dto, order);
      const res = await this.orderService.create(createdUsers[0]._id, dto);
      createdOrders.push(res);
    }

    // seed driver and user history
    for (let i = 0; i < 10; i++) {
      await Promise.all([
        this.historyService.createHistory(driver._id, {
          title: 'New Order',
          description: 'Drop-off Point',
          amount: createdOrders[0].orderAmount,
          type: HistoryTypeEnum.Order,
          status: DeliveryCompleted,
          fromLocation: createdOrders[0].pickupAddress,
          toLocation: createdOrders[0].destinationAddress,
          orderId: createdOrders[0]._id,
        }),

        this.historyService.createHistory(user._id, {
          title: 'New Order',
          description: 'Drop-off Point',
          amount: createdOrders[0].orderAmount,
          type: HistoryTypeEnum.Order,
          status: DeliveryCompleted,
          fromLocation: createdOrders[0].pickupAddress,
          toLocation: createdOrders[0].destinationAddress,
          orderId: createdOrders[0]._id,
        }),
      ]);
    }

    return {
      success: true,
      message: 'seeded successfully',
      data: {
        users: createdUsers,
        orders: createdOrders,
      },
    };
  }
}
