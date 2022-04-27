import { forwardRef, Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module';
import { ConfigService } from './config.service';
import { TimeoutModule } from '../timeout/timeout.module';
import { PlaceModule } from '../socket/place.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSchema, ConfigSchemaObject } from './config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigSchemaObject.name, schema: ConfigSchema },
    ]),
    forwardRef(() => CanvasModule),
    forwardRef(() => PlaceModule),
    forwardRef(() => TimeoutModule),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
