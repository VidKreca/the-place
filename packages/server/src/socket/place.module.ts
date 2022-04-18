import { Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { TimeoutService } from '../timeout/timeout.service';
import { PlaceGateway } from './place.gateway';

@Module({
  imports: [CanvasModule],
  providers: [PlaceGateway, TimeoutService],
})
export class PlaceModule {}
