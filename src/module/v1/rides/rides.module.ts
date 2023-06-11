import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RidesSchema } from './schema/rides.schema';
import { SpacesModule } from '../spaces/spaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RidesSchema }]),
    SpacesModule,
  ],
  controllers: [RidesController],
  providers: [RidesService],
})
export class RidesModule {}
