import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderController } from './order.controller';
import { Cart, CartSchema } from '../cart/schema/cart.schema';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    PaymentModule,
    CartModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
