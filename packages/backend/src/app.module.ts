import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { CanvasService } from './canvas/canvas.service';

@Module({
  imports: [PlaceModule],
  providers: [CanvasService],
})
export class AppModule {}
