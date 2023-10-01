import { IsString } from 'class-validator';

export class OrderDto {
  @IsString()
  cartId: string;
}
