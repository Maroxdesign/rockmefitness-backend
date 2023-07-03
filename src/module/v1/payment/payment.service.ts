import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Payment, PaymentDocument} from './schema/payment.schema';
import {Model} from 'mongoose';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import * as Paystack from 'paystack';
import {IPaystackPayment, IPaystackPaymentMetadata,} from 'src/common/constants/payment';
import {OrdersService} from '../orders/orders.service';
import {PaymentStatus} from "../../../common/constants/order.constants";
import {HistoryService} from "../history/history.service";
import {HistoryTypeEnum, PendingPickup} from "../../../common/constants/history.constants";

@Injectable()
export class PaymentService {
  private logger = new Logger(PaymentService.name);
  private paystack: Paystack;

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    private historyService: HistoryService
  ) {
    this.paystack = new Paystack(process.env.PAYSTACK_SECRET);
  }

  async initializePaystackPayment(
    payload: IPaystackPayment,
    metadata: IPaystackPaymentMetadata,
  ) {
    try {
      return await this.paystack.transaction.initialize({
        ...payload,
        metadata,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async verifyPaystackPayment(ref: string) {
    try {
      const response = await this.paystack.transaction.verify(ref);

      if (response.data.status !== 'success') {
        throw new BadRequestException('Invalid payment');
      }

      let { status, amount, currency, reference, metadata } = response.data;
      // divide by 100 to get actual price
      amount = amount / 100

      const paymentExists = await this.paymentModel.findOne({
        reference,
      });

      if (paymentExists) {
        throw new BadRequestException('Invalid payment');
      }

      const payment = await this.paymentModel.create({
        amount,
        status,
        currency,
        reference,
        orderId: metadata.orderId,
        userId: metadata.userId,
      });

      await this.historyService.createHistory(metadata.userId, {
        title: "Payment Successful!",
        description: `Package delivery payment of N${amount} successful made`,
        type: HistoryTypeEnum.Payment,
        status: "SUCCESS"
      })

      if (metadata.orderId) {
        await this.orderService.updateOrder(metadata.orderId, {
          paymentStatus: PaymentStatus.PAID,
        });

        await this.historyService.updateHistoryByOrderId(metadata.orderId, {
          status: PendingPickup
        })

        return await this.orderService.getOrderById(metadata.orderId);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  async createPayment(payload: CreatePaymentDto): Promise<Payment> {
    return await this.paymentModel.create(payload);
  }

  async updatePayment(id: string, payload: UpdatePaymentDto): Promise<Payment> {
    return this.paymentModel.findByIdAndUpdate({ _id: id }, { payload });
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    return await this.paymentModel.findOne({ orderId }).exec();
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await this.paymentModel.find({ userId }).exec();
  }
}
