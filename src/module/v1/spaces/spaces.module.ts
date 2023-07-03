import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { DoSpacesProvider } from './config';

@Module({
  providers: [SpacesService, DoSpacesProvider],
  exports: [SpacesService],
})
export class SpacesModule {}
