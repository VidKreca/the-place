import { forwardRef, Module } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { Canvas, CanvasSchema } from '../canvas/canvas.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
    forwardRef(() => ConfigModule),
  ],
  providers: [CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
