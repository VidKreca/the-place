import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeoutModule } from './timeout/timeout.module';
import { CanvasModule } from './canvas/canvas.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    PlaceModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    TimeoutModule,
    CanvasModule,
    ConfigModule,
    AdminModule,
  ],
})
export class AppModule {}
