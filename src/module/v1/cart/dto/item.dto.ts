import { IsNumber, IsString } from 'class-validator';

export class ItemDTO {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
