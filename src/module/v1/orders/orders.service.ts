import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
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
config();

@Injectable()
export class OrdersService {
  private readonly googleDirectionApiKey = process.env.GOOGLE_DIRECTION_API_KEY;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private userService: UserService,
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

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId });
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
}
