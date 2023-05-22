import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsBoolean()
  @IsOptional()
  suspend?: boolean;

  @IsBoolean()
  @IsOptional()
  deactivate?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  newPassword: string;
}

export class SwitchAvailabilityDto {
  @IsBoolean()
  driverAvailability?: boolean;
}
