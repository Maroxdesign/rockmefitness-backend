import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KycModule } from '../kyc/kyc.module';
import { ProvidusModule } from '../providus/providus.module';
import { TokenModule } from '../token/token.module';
import { UnusedAccountModule } from '../unused-account/unused-account.module';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ProvidusModule,
    KycModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule,
    UnusedAccountModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
