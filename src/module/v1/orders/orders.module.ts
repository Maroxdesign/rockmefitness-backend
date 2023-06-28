import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderGateway } from './order.gateway';
import { DriverModule } from '../driver/driver.module';
import { UserModule } from '../user/user.module';
import { PaymentModule } from '../payment/payment.module';
import {HistoryModule} from "../history/history.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => DriverModule),
    forwardRef(() => UserModule),
    PaymentModule,
      HistoryModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderGateway],
  exports: [OrdersService],
})
export class OrdersModule {}
