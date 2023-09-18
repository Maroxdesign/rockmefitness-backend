import { IsOptional, IsString } from 'class-validator';

export class OrderQueryDto {
  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  limit?: number;
}
