import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;
}
