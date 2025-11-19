import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LevelProgress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  levelId: string;

  @Prop({ required: true })
  stars: number;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  completed: boolean;
}

export type LevelProgressDocument = LevelProgress & Document;
export const LevelProgressSchema = SchemaFactory.createForClass(LevelProgress);
