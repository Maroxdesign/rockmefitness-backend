import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schema/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Ticket.name, schema: TicketSchema}])
  ],
  controllers: [SupportController],
  providers: [SupportService]
})
export class SupportModule {}
