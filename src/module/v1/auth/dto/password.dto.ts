import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ForgotPasswordResetDto extends ForgotPasswordDto {
  @IsNumber()
  otp: number;

  @IsString()
  password: string;
}
