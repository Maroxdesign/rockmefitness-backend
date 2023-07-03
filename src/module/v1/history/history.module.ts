import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {HistorySchema, History} from "./schema/history.schema";

@Module({
  imports: [
      MongooseModule.forFeature([{name: History.name, schema: HistorySchema}])
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService]
})
export class HistoryModule {}
