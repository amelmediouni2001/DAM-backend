import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Level {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  theme: string; // Batman, Spider-Man

  @Prop({ required: true })
  story: string;

  @Prop({ type: [String], required: true })
  expectedNotes: string[];

  @Prop({ required: true })
  difficulty: number;
}

export type LevelDocument = Level & Document;
export const LevelSchema = SchemaFactory.createForClass(Level);
