import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsArray()
  rejectedDriverIds?: string[];

  @IsOptional()
  @IsString()
  eta?: string;
}
