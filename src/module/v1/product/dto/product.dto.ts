import { IsArray, IsNumberString, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  productDetails: string;

  @IsArray()
  color: [];

  @IsString()
  tags: string;

  @IsString()
  category: string;

  @IsNumberString()
  price: number;

  @IsNumberString()
  quantity: number;
}
