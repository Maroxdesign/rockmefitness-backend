import { Equals, IsString, Length } from 'class-validator';

export class BvnCheckDto {
  @IsString()
  identity: string;
}

export class NinCheckDto {
  @IsString()
  identity: string;
}

export class NinDto {
  @IsString()
  identity: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  dob: string;

  @IsString()
  phone: string;
}

export class BvnDto {
  @IsString()
  identity: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  dob: string;

  @IsString()
  phone: string;
}
