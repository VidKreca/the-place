import { forwardRef, Module } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [forwardRef(() => ConfigModule)],
  providers: [CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
