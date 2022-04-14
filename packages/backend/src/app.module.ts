import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';

@Module({
  imports: [PlaceModule],
})
export class AppModule {}
