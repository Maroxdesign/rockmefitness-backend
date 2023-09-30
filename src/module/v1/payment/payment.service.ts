import { Inject, Injectable } from '@nestjs/common';
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

  async processPayment(paymentData) {
    const token = await this.generateClientToken();
    console.log(token);
    try {
      const result = await this.braintreeGateway.transaction.sale({
        amount: '100.00',
        paymentMethodNonce: 'fake-valid-nonce',
        deviceData: paymentData,
        options: {
          submitForSettlement: true,
        },
      });

      console.log(result);

      if (result.success) {
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
}
