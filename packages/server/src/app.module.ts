import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config.json';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.url, {
      dbName: config.mongodb.database_name,
    }),
    PlaceModule,
    AdminModule,
  ],
})
export class AppModule {}
