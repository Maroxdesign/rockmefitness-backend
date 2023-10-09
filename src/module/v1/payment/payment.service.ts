import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import * as paypal from 'paypal-rest-sdk';
import { environment } from '../../../common/config/environment';
import { Order, OrderDocument } from '../order/schema/order.schema';
import { Product, ProductDocument } from '../product/schema/product.schema';
@Injectable()
export class PaymentService {
  private readonly paypalConfig: any;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.paypalConfig = {
      mode: 'sandbox',
      client_id: environment.PAYPAL.CLIENT_ID,
      client_secret: environment.PAYPAL.SECRET_KEY,
    };
    paypal.configure(this.paypalConfig);
  }

  async paginate(query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.paymentModel.countDocuments();
    const response = await this.paymentModel
      .find()
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate('order')
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

  async getUserPayments(query: any, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.paymentModel.countDocuments({
      user: user._id,
    });
    const response = await this.paymentModel
      .find({ user: user._id })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate('order')
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

  async createPayment(order) {
    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${environment.APP.BASE_URL}/payment/success`,
        cancel_url: `${environment.APP.BASE_URL}/payment/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'item',
                sku: 'item',
                price: order.amount.toString(),
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: order.amount.toString(),
          },
          description: order.reference,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(createPaymentJson, async (error, payment) => {
        if (error) {
          reject(error);
        } else {
          await this.paymentModel.create({
            amount: order.amount,
            txn_id: payment.id,
            reference: order.reference,
            order: order._id,
            user: order.user,
            status: 'pending',
          });
          resolve(payment);
        }
      });
    });
  }

  async executePayment(paymentId: string, payerId: string) {
    const executePaymentJson = {
      payer_id: payerId,
    };

    return new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        executePaymentJson,
        async (error, payment) => {
          if (error) {
            reject(error);
          } else {
            const reference = payment.transactions[0].description;
            // Update the order and payment status in your database

            const order = await this.orderModel.findOneAndUpdate(
              { reference: reference },
              { status: 'success' },
              { new: true },
            );

            await this.paymentModel.findOneAndUpdate(
              { txn_id: paymentId },
              { status: 'success' },
              { new: true },
            );

            // Loop through order items and update product quantities
            for (const item of order.items) {
              const product = await this.productModel.findOne({
                _id: item,
              });

              if (product) {
                // Calculate the new quantity by subtracting the ordered quantity
                const newQuantity = product.quantity - order.quantity;

                // Update the product quantity in the database
                await this.productModel.findOneAndUpdate(
                  { _id: item },
                  { quantity: newQuantity },
                  { new: true },
                );
              }
            }

            //TODO: clear user cart from BACKEND using order object data

            resolve(payment);

            return payment;
          }
        },
      );
    });
  }
}
