import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  rating: string;
}
