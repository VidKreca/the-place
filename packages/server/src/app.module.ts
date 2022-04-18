import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PlaceModule,
    AdminModule,
    MongooseModule.forRoot('mongodb://localhost/place'),
  ],
})
export class AppModule {}
