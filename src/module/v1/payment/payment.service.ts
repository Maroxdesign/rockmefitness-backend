import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { BraintreeGateway } from 'braintree';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @Inject('BraintreeGateway')
    private readonly braintreeGateway: BraintreeGateway,
  ) {}

  async generateClientToken() {
    try {
      const response = await this.braintreeGateway.clientToken.generate();
      return { clientToken: response.clientToken };
    } catch (error) {
      throw new Error('Failed to generate client token');
    }
  }

  async processPayment(paymentData, user) {
    const orderId = paymentData.order._id;
    const paymentAmount = paymentData.order.amount;

    try {
      const payment = await this.paymentModel.create({
        amount: paymentAmount,
        reference: paymentData.order.reference,
        order: orderId,
        user: user._id,
        status: 'pending',
      });

      if (!payment) {
        throw new BadRequestException('Invalid Payment');
      }

      const result = await this.braintreeGateway.transaction.sale({
        amount: paymentAmount.toString(),
        paymentMethodNonce: paymentData.nonce ?? 'fake-valid-nonce',
        options: {
          submitForSettlement: true,
        },
      });

      if (result.success) {
        await this.updatePayment(payment._id, {
          status: result.transaction.status,
        });

        return {
          message: 'Payment successful',
          data: result.transaction,
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw new Error(error.message);
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

  async updatePayment(id, payload) {
    return await this.paymentModel.findByIdAndUpdate(
      id,
      { status: payload.status, ...payload },
      { new: true },
    );
  }
}
