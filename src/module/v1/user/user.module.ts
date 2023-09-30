import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../token/token.module';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SpacesModule } from '../spaces/spaces.module';
import { Cart, CartSchema } from '../cart/schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    TokenModule,
    SpacesModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
