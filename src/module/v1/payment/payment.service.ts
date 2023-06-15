import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

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
