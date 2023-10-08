import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import * as paypal from 'paypal-rest-sdk';
import { environment } from '../../../common/config/environment';
import { Order, OrderDocument } from '../order/schema/order.schema';
@Injectable()
export class PaymentService {
  private readonly paypalConfig: any;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
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

  async createPayment(amount, reference) {
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
                price: amount.toString(),
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: amount.toString(),
          },
          description: reference,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          reject(error);
        } else {
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
            // Update the order status in your database
            const order = await this.orderModel.findOneAndUpdate(
              { reference: reference },
              { status: 'success' },
              { new: true },
            );
            //TODO: clear user cart from BACKEND using order object data

            resolve(payment);

            return payment;
          }
        },
      );
    });
  }
}
