import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateRideDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  pricePerKilometer: string;
}
