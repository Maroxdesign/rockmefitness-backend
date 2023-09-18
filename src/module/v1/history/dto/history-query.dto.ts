import { IsOptional, IsString } from 'class-validator';

export class HistoryQueryDto {
  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  limit?: number;
}
