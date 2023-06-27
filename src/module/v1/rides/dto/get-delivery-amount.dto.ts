import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class GetDeliveryAmountDto {
  @IsNotEmpty()
  @IsNumber()
  fromLatitude: number;

  @IsNotEmpty()
  @IsNumber()
  fromLongitude: number;

  @IsNotEmpty()
  @IsNumber()
  toLatitude: number;

  @IsNotEmpty()
  @IsNumber()
  toLongitude: number;

  @IsNotEmpty()
  @IsString()
  packageType: string;
}
