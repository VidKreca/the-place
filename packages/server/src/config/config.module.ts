import { Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { TimeoutService } from '../timeout/timeout.service';
import { ConfigService } from './config.service';
import { PlaceGateway } from '../socket/place.gateway';

@Module({
  providers: [ConfigService, TimeoutService, PlaceGateway],
  imports: [CanvasModule],
  exports: [ConfigService],
})
export class ConfigModule {}
