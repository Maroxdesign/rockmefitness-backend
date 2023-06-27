import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../orders/schema/order.schema';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
