import { IsEnum, IsNotEmpty } from "class-validator";
import { TicketStatus } from "src/common/constants/ticket.enum";

export class UpdateTicketStatusDto {
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: string
}