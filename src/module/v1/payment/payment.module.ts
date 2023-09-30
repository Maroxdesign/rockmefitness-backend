import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import * as braintree from 'braintree';
import { environment } from '../../../common/config/environment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  providers: [
    PaymentService,
    {
      provide: 'BraintreeGateway',
      useValue: new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        merchantId: environment.BRAINTREE.MERCHANT_ID,
        publicKey: environment.BRAINTREE.PUBLIC_KEY,
        privateKey: environment.BRAINTREE.PRIVATE_KEY,
      }),
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
