import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Cart } from '../../cart/schema/cart.schema';
import { User } from '../../user/schema/user.schema';
import { DeliveryDetail } from './delivery-detail.schema';

export type OrderDocument = Order &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, trim: true })
  amount: number;

  @Prop()
  reference: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Cart.name })
  cart?: Cart;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;

  @Prop()
  items: [];

  @Prop()
  sizes: [];

  @Prop()
  colors: [];

  @Prop()
  status: string;

  @Prop({ default: {} })
  deliveryDetail: DeliveryDetail;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
