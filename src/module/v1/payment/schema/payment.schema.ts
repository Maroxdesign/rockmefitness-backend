import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Order } from '../../order/schema/order.schema';
import { User } from '../../user/schema/user.schema';

export type PaymentDocument = Payment &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, trim: true })
  amount: number;

  @Prop()
  txn_id: string;

  @Prop()
  reference: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
  order?: Order;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;

  @Prop()
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
