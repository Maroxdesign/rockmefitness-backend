import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Cart, CartDocument } from '../cart/schema/cart.schema';
import { PaymentService } from '../payment/payment.service';
import { CartService } from '../cart/cart.service';
import { defineDefaultCommandsOnRepl } from '@nestjs/core/repl/repl-native-commands';
import { populate } from 'dotenv';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
  ) {}

  async create(data, user) {
    const userCart = await this.cartModel.findOne({ user: user._id });
    if (!userCart || userCart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const cartObj = await this.cartService.showUserCart(user);
    let totalPrice = 0;

    const deliveryData = {
      'deliveryDetail.firstName': data.firstName,
      'deliveryDetail.lastName': data.lastName,
      'deliveryDetail.email': data.email,
      'deliveryDetail.phone': data.phone,
      'deliveryDetail.address': data.address,
      'deliveryDetail.city': data.city,
      'deliveryDetail.state': data.state,
      'deliveryDetail.zipCode': data.zipCode,
    };

    const cartData = cartObj;

    cartData.forEach((cart) => {
      cart.cartItems.forEach((cartItem) => {
        cartItem.product.variants.forEach((variant) => {
          if (variant._id === cartItem.variant) {
            totalPrice = variant.price * cartItem.quantity;
          }
        });
        console.log('Total price for item:', totalPrice);
      });
    });

    // // Add tax to total price
    const totalAmount = (await this.getTax(totalPrice)) + totalPrice;

    const requestData = {
      amount: totalAmount,
      user: user._id,
      cart: userCart._id,
      status: 'pending',
      reference: await this.generateRandomCharacters(7),
    };

    const storageData = { ...requestData, ...deliveryData };

    // /** create an order **/
    const order = await this.orderModel.create(storageData);

    /** process payment **/
    const paypal = await this.paymentService.createPayment(order);

    const paymentLink = paypal['links'].find(
      (link) => link.rel === 'approval_url',
    ).href;

    return { order, paymentLink };
  }

  async getTax(amount) {
    const percentage = 5;
    return (amount * percentage) / 100;
  }

  async paginate(query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.orderModel.countDocuments();
    const response = await this.orderModel
      .find()
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
    });

    const response = await this.orderModel
      .find({ user: user._id })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate('user')
      .populate('cart');

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

  async viewSingleOrder(orderId: string) {
    const order = await this.orderModel
      .findOne({
        _id: orderId,
      })
      .populate('cart')
      .populate('user');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
