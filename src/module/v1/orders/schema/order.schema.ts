import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum PickupType {
  NOW = 'NOW',
  SCHEDULE = 'SCHEDULE',
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ required: true })
  destinationAddress: string;

  @Prop({ required: true })
  fromLongitude: number;

  @Prop({ required: true })
  fromLatitude: number;

  @Prop({ required: true })
  toLongitude: number;

  @Prop({ required: true })
  toLatitude: number;

  @Prop({ required: true })
  packageType: string;

  @Prop({ required: true, trim: true })
  recipientName: string;

  @Prop({ required: true })
  recipientPhone: string;

  @Prop({ required: true })
  pickupType: PickupType;

  @Prop({ required: false })
  pickupDate: Date;

  @Prop({ required: false })
  pickupTime: string;

  @Prop({ required: true })
  rideType: string;

  // TODO: changet type to mongoose.Schema.Types.ObjectId
  @Prop({ required: true })
  rideId: string;

  @Prop({ required: true })
  orderAmount: number;

  @Prop({ required: true, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ required: true, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ required: false })
  paymentId: string;

  // TODO: changet type to mongoose.Schema.Types.ObjectId
  @Prop({ required: true })
  userId: string;

  // TODO: changet type to mongoose.Schema.Types.ObjectId
  @Prop({ required: false })
  driverId: string;

  @Prop({ required: true, default: false })
  isPickedUp: boolean;

  @Prop({ required: true, default: false })
  isDelivered: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
