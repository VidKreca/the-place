import { forwardRef, Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { TimeoutService } from '../timeout/timeout.service';
import { ConfigService } from './config.service';
import { PlaceGateway } from '../socket/place.gateway';

@Module({
  imports: [forwardRef(() => CanvasModule)],
  providers: [ConfigService, TimeoutService, PlaceGateway],
  exports: [ConfigService],
})
export class ConfigModule {}
