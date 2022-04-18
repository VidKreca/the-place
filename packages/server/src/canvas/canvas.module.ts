import { Module } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { Canvas, CanvasSchema } from '../canvas/canvas.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeoutService } from '../timeout/timeout.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
  ],
  providers: [CanvasService, TimeoutService],
  exports: [CanvasService],
})
export class CanvasModule {}
