import {IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
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
    @IsString()
    amount: string;

    @IsOptional()
    @IsString()
    fromLocation: string;

    @IsOptional()
    @IsString()
    toLocation: string;
}