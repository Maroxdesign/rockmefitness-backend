import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import {OrderStatus, PaymentStatus, PickupType} from "../../../../common/constants/order.constants";

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
  pickupDate: string;

  @Prop({ required: false })
  pickupTime: string;

  @Prop({ required: true })
  rideType: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Ride' })
  rideId: string;

  @Prop({ required: true })
  orderAmount: number;

  @Prop({ required: true, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ required: true, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  driverId: string;

  @Prop({ required: true, default: false })
  isPickedUp: boolean;

  @Prop({ required: true, default: false })
  isDelivered: boolean;

  @Prop({ required: false })
  rejectedDriverIds: string[];

  @Prop({ required: false })
  eta: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
