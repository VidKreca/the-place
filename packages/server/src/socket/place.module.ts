import { Module } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { TimeoutService } from '../timeout/timeout.service';
import { PlaceGateway } from './place.gateway';

@Module({
  providers: [PlaceGateway, CanvasService, TimeoutService],
})
export class PlaceModule {}
