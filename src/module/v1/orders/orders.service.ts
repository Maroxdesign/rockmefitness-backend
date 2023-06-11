import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(
    userId: string,
    payload: CreateOrderDto,
  ): Promise<OrderDocument> {
    try {
      return await this.orderModel.create({
        ...payload,
        userId,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
