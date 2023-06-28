import { IsEnum, IsOptional } from 'class-validator';

import {PaymentStatus} from "../../../../common/constants/order.constants";

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
