import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PlaceGateway } from '../socket/place.gateway';
import { TimeoutService } from '../timeout/timeout.service';
import { AdminController } from './admin.controller';
import { CanvasModule } from '../canvas/canvas.module';

@Module({
  imports: [ConfigModule, CanvasModule],
  providers: [PlaceGateway, TimeoutService],
  controllers: [AdminController],
})
export class AdminModule {}
