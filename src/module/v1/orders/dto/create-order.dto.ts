import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus, PaymentStatus, PickupType } from '../schema/order.schema';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  pickupAddress: string;

  @IsNotEmpty()
  @IsString()
  destinationAddress: string;

  @IsNotEmpty()
  @IsNumberString()
  fromLongitude: number;

  @IsNotEmpty()
  @IsNumberString()
  fromLatitude: number;

  @IsNotEmpty()
  @IsNumberString()
  toLongitude: number;

  @IsNotEmpty()
  @IsNumberString()
  toLatitude: number;

  @IsNotEmpty()
  @IsString()
  packageType: string;

  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @IsNotEmpty()
  @IsString()
  recipientPhone: string;

  @IsNotEmpty()
  @IsEnum(PickupType)
  pickupType: PickupType;

  @IsOptional()
  @IsNotEmpty()
  pickupDate: string;

  @IsNotEmpty()
  @IsString()
  rideType: string;

  @IsNotEmpty()
  @IsString()
  rideId: string;

  @IsNotEmpty()
  @IsNumberString()
  orderAmount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  driverId: string;

  @IsOptional()
  @IsBoolean()
  isPickedUp: boolean;

  @IsOptional()
  @IsBoolean()
  isDelivered: boolean;
}
