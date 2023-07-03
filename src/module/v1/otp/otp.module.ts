import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from '../user/schema/user.schema';
import { UserModule } from '../user/user.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
  imports: [
    UserModule,
    MailModule,
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
