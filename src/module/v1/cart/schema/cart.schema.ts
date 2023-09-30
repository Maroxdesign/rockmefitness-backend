import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Item } from './item.schema';

export type CartDocument = Cart &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Cart {
  @Prop()
  items: Item[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
