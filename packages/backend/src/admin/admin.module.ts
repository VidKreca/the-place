import { Module } from '@nestjs/common';
import { CanvasService } from '../canvas/canvas.service';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [CanvasService, TimeoutService],
  controllers: [AdminController],
})
export class AdminModule {}
