import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    PlaceModule,
    AdminModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule,
  ],
})
export class AppModule {}
