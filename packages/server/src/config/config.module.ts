import { Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { TimeoutService } from '../timeout/timeout.service';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService, TimeoutService],
  imports: [CanvasModule],
  exports: [ConfigService],
})
export class ConfigModule {}
