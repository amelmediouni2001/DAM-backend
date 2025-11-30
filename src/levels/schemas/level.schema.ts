import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Level {
  @Prop({ required: true })
  order: number;  // determines level order in the map

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  theme: string;

  @Prop({ required: true })
  story: string;

  @Prop({ type: [String], required: true })
  expectedNotes: string[];

  @Prop({ required: true })
  difficulty: number;

  @Prop({ required: false })
  backgroundUrl: string;

  @Prop({ required: false })
  bossUrl: string;

  @Prop({ required: false })
  musicUrl: string;

  @Prop({ required: false })
  previewAudioUrl: string;  // Song preview URL to play before gameplay

  @Prop({ required: false, default: 10 })
  previewDuration: number;  // Duration in seconds (for UI progress)

  @Prop({ required: false, default: false })
  autoPlayPreview: boolean;  // Auto-play on level load

  @Prop({ required: false, default: 0 })
  starsUnlocked: number;

  @Prop({
    type: {
      x: Number,
      y: Number
    },
    required: true
  })
  mapPosition: {
    x: number;
    y: number;
  };

  @Prop({ required: true })
  islandImageUrl: string;

  @Prop({ required: false })
  nextLevelId?: string;

  @Prop({ required: false })
  colorTheme?: string; // hex string for UI color
}

export type LevelDocument = Level & Document;
export const LevelSchema = SchemaFactory.createForClass(Level);