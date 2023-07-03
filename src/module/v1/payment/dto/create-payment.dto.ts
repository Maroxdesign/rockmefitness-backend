import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

import {PaymentStatus} from "../../../../common/constants/order.constants";

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
