import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatus } from 'src/common/constants/ticket.enum';
import { Message } from './message.schema';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN })
  status: string;

  @Prop()
  messages: [Message]
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
