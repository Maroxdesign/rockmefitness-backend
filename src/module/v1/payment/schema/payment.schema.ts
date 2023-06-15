import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
