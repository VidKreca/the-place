import { Module } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { PlaceGateway } from './place.gateway';

@Module({
  providers: [PlaceGateway, CanvasService],
})
export class PlaceModule {}
