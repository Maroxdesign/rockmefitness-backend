import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Item, ItemSchema } from './item.schema';

export type CartDocument = Cart &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;

  @Prop({ type: [ItemSchema], default: [] })
  cartItems: Item[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
