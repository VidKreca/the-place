import { forwardRef, Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { ConfigService } from './config.service';
import { TimeoutModule } from '../timeout/timeout.module';
import { PlaceModule } from '../socket/place.module';

@Module({
  imports: [
    forwardRef(() => CanvasModule),
    forwardRef(() => PlaceModule),
    forwardRef(() => TimeoutModule),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
