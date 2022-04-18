import { Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { PlaceGateway } from '../socket/place.gateway';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [CanvasModule],
  providers: [TimeoutService, PlaceGateway],
  controllers: [AdminController],
})
export class AdminModule {}
