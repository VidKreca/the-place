import { Module } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { PlaceGateway } from '../socket/place.gateway';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [CanvasService, TimeoutService, PlaceGateway],
  controllers: [AdminController],
})
export class AdminModule {}
