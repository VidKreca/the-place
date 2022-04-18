import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DrawMessage } from '../interfaces/Messages';
import { Document } from 'mongoose';
import { Config } from '../interfaces/Config';

export type CanvasDocument = Canvas & Document;

@Schema()
export class Canvas {
  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  image: number[][][];

  @Prop()
  history: DrawMessage[];

  @Prop({ type: Object })
  config: Config;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
