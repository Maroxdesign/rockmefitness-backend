import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import axios from 'axios';
import { config } from 'dotenv';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../user/user.service';
import { HistoryService } from '../history/history.service';
import {
  HistoryTypeEnum,
  OrderCanceled,
  PendingPayment,
} from '../../../common/constants/history.constants';
import { OrderStatus } from '../../../common/constants/order.constants';
import { RoleEnum } from '../../../common/constants/user.constants';
import { OrderQueryDto } from './dto/order-query.dto';

config();

@Injectable()
export class OrdersService {
  private readonly googleDirectionApiKey = process.env.GOOGLE_DIRECTION_API_KEY;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private userService: UserService,
    private historyService: HistoryService,
  ) {}

  async create(userId: string, payload: CreateOrderDto) {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('invalid user');
      }

      const order = await this.orderModel.create({
        ...payload,
        userId,
      });

      // create history
      await this.historyService.createHistory(userId, {
        title: 'New Order',
        description: 'Drop-off Point',
        amount: payload.orderAmount,
        type: HistoryTypeEnum.Order,
        status: PendingPayment,
        fromLocation: payload.pickupAddress,
        toLocation: payload.destinationAddress,
        orderId: order._id,
      });

      return await this.paymentService.initializePaystackPayment(
        {
          email: user.email,
          amount: payload.orderAmount * 100,
          callback_url: `${process.env.APP_BASE_URL}/api/v1/payment/verify`,
        },
        {
          orderId: order._id,
          userId,
        },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserOrders(userId: string, query?: OrderQueryDto) {
    let { page, limit } = query;

    page = Number(page) ? Number(page) : 1;
    limit = Number(limit) ? Number(limit) : 10;

    const user = await this.userService.findById(userId);

    if (!user) {
      return null;
    }

    const [result, count] = await Promise.all([
      this.orderModel
        .find({
          ...(user.role === RoleEnum.RIDER ? { driverId: userId } : { userId }),
        })
        .skip(limit * (page - 1))
        .limit(limit),

      this.orderModel.countDocuments({
        ...(user.role === RoleEnum.RIDER ? { driverId: userId } : { userId }),
      }),
    ]);

    return {
      data: result,
      pagination: {
        total: count,
        limit,
        page,
      },
    };
  }

  async getOrderById(orderId: string): Promise<OrderDocument> {
    return await this.orderModel.findById(orderId);
  }

  async assignDriverToOrder(driverId: string, orderId: string): Promise<void> {
    const order = await this.orderModel.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        driverId,
      },
      {
        new: true,
      },
    );
  }

  async updateOrder(orderId: string, payload: UpdateOrderDto): Promise<void> {
    await this.orderModel.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        ...payload,
      },
      {
        new: true,
      },
    );
  }

  async calculateEta(
    fromLon: number,
    fromLat: number,
    toLon: number,
    toLat: number,
  ) {
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLon}&destination=${toLon},${toLat}&key=${this.googleDirectionApiKey}`;

    try {
      const response = await axios.get(apiUrl);

      return response.data.routes[0].legs[0].duration.text;
    } catch (error) {
      throw new Error('Failed to calculate ETA.');
    }
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new BadRequestException(
        'You are not authorized to cancel this order',
      );
    }

    if (order.driverId) {
      throw new BadRequestException(
        'You cannot cancel an order that has been assigned to a driver',
      );
    }

    // create history
    await this.historyService.createHistory(userId, {
      title: 'Order Cancelled',
      description: 'Drop-off Point',
      amount: order.orderAmount / 100,
      type: HistoryTypeEnum.Order,
      fromLocation: order.pickupAddress,
      toLocation: order.destinationAddress,
      orderId: order._id,
      status: OrderCanceled,
    });

    return this.orderModel.findByIdAndUpdate(
      {
        _id: orderId,
      },
      {
        orderStatus: OrderStatus.CANCELLED,
      },
      {
        new: true,
      },
    );
  }
}
