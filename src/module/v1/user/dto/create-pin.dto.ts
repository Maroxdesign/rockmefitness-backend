import { Equals, IsString, Length } from 'class-validator';

export class CreatePinDto {
  @IsString()
  @Length(4, 4)
  pin: string;
}

export class UpdatePinDto {
  @IsString()
  pin: string;

  @IsString()
  @Length(4, 4)
  newPin: string;
}
