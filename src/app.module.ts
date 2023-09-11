import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { environment } from './common/config/environment';
import { AuthModule } from './module/v1/auth/auth.module';
import { MailModule } from './module/v1/mail/mail.module';
import { OtpModule } from './module/v1/otp/otp.module';
import { TokenModule } from './module/v1/token/token.module';
import { UserModule } from './module/v1/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SupportModule } from './module/v1/support/support.module';
import { RatingModule } from './module/v1/rating/rating.module';
import { RidesModule } from './module/v1/rides/rides.module';
import { OrdersModule } from './module/v1/orders/orders.module';
import { PaymentModule } from './module/v1/payment/payment.module';
import { HistoryModule } from './module/v1/history/history.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 5, //seconds
      limit: 1,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: environment.DB.URL,
        keepAlive: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    OtpModule,
    MailModule,
    TokenModule,
    SupportModule,
    RatingModule,
    RidesModule,
    OrdersModule,
    PaymentModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
