import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryDetailDocument = DeliveryDetail & Document;

@Schema({ _id: false, timestamps: false })
export class DeliveryDetail {
  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  state: string;

  @Prop({ trim: true })
  zipCode: string;
}

export const DeliveryDetailSchema =
  SchemaFactory.createForClass(DeliveryDetail);
