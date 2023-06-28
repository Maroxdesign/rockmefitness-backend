import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {HistoryTypeEnum} from "../../../../common/constants/history.constants";

export class CreateHistoryDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(HistoryTypeEnum)
    type: HistoryTypeEnum

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsString()
    fromLocation?: string;

    @IsOptional()
    @IsString()
    toLocation?: string;

    @IsOptional()
    @IsString()
    orderId?: string;
}