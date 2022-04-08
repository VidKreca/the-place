import { Module } from '@nestjs/common';
import { PlaceGateway } from './place.gateway';

@Module({
  providers: [PlaceGateway],
})
export class PlaceModule {}
