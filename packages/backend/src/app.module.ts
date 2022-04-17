import { Module } from '@nestjs/common';
import { PlaceModule } from './socket/place.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PlaceModule, AdminModule],
})
export class AppModule {}
