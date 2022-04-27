import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    PlaceModule,
    AdminModule,
  ],
})
export class AppModule {}
