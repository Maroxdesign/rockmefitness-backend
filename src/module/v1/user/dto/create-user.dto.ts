import {
  IsEmail,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  firstName: string;

  @Length(2, 30)
  @IsString()
  lastName: string;

  @IsString()
  dialCode: string;

  @IsString()
  @Length(10, 11)
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  country: string;
}

export class UserByEmailDto {
  @IsString()
  email: string;
}

export class TokenDto {
  @IsString()
  token: string;

  @IsString()
  @IsOptional()
  user: string;
}
