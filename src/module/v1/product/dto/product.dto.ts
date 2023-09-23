import { IsNumberString, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  productDetails: string;

  @IsString()
  color: string;

  @IsString()
  tags: string;

  @IsString()
  category: string;

  @IsNumberString()
  price: number;
}
