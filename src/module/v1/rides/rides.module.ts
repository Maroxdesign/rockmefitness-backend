import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rides, RidesSchema } from './schema/rides.schema';
import { SpacesModule } from '../spaces/spaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Rides.name, schema: RidesSchema}]),
    SpacesModule
  ],
  controllers: [RidesController],
  providers: [RidesService]
})
export class RidesModule {}
