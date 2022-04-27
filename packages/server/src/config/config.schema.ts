import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DrawMessage } from '../interfaces/Messages';
import { Document } from 'mongoose';
import { Config as IConfig } from '../interfaces/Config';

export type ConfigDocument = ConfigSchemaObject & Document;

@Schema()
export class ConfigSchemaObject {
  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  image: number[][][];

  @Prop()
  history: DrawMessage[];

  @Prop({ type: Object })
  config: IConfig;
}

export const ConfigSchema = SchemaFactory.createForClass(ConfigSchemaObject);
