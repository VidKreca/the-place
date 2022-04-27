import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [forwardRef(() => ConfigModule)],
  controllers: [AdminController],
})
export class AdminModule {}
