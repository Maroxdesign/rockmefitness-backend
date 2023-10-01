import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Cart, CartDocument } from '../cart/schema/cart.schema';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async create(data, user) {
    try {
      const { cartId } = data;

      const cart = await this.cartModel.findOne({ _id: cartId });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      /** create an order **/
      const order = await this.orderModel.create({
        amount: cart.totalPrice,
        user: user._id,
        cart: cart._id,
        status: 'pending',
        reference: await this.generateRandomCharacters(7),
      });

      /** process payment **/
      const payment = await this.paymentService.processPayment(order, user);

      if (payment) {
        order.status = 'success';
        await order.save();
      }

      return {
        order,
        payment,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async paginate(query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.orderModel.countDocuments({ status: 'success' });
    const response = await this.orderModel
      .find({ status: 'success' })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate('cart')
      .populate('user');

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async getUserOrders(query: any, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.orderModel.countDocuments({
      user: user._id,
      status: 'success',
    });
    const response = await this.orderModel
      .find({ user: user._id, status: 'success' })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate('cart')
      .populate('user');

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  private async generateRandomCharacters(length) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    while (result.length < length) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      const randomChar = charset.charAt(randomIndex);

      // Ensure the character is not already in the result
      if (!result.includes(randomChar)) {
        result += randomChar;
      }
    }

    return result;
  }
}
