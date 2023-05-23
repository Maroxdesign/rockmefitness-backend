import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature()
  ],
  controllers: [SupportController],
  providers: [SupportService]
})
export class SupportModule {}
