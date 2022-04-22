import { forwardRef, Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { TimeoutModule } from '../timeout/timeout.module';
import { PlaceGateway } from './place.gateway';

@Module({
  imports: [forwardRef(() => CanvasModule), forwardRef(() => TimeoutModule)],
  providers: [PlaceGateway],
  exports: [PlaceGateway],
})
export class PlaceModule {}
