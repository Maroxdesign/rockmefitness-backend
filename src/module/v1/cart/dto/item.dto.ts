import { IsNumber, IsString } from 'class-validator';

export class ItemDTO {
  @IsString()
  product: string;

  @IsNumber()
  quantity: number;
}
