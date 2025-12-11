import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Level } from '../../levels/schemas/level.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Sublevel {

  @ApiProperty({
    description: 'ID of the parent level',
    example: '678a91c25f099c0023cb542a'
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Level.name,
    required: true,
  })
  levelId: string;

  @ApiProperty({
    description: 'Order of sublevel inside the level (1–5)',
    example: 1,
  })
  @Prop({ required: true })
  index: number;

  @ApiProperty({
    description: 'Title of the sublevel',
    example: 'Discover the Notes',
  })
  @Prop({ required: false })
  title: string;

  @ApiProperty({
    description: 'Short description or goal for the sublevel',
    example: 'Learn the first 2 notes and feel the Batman vibe!',
  })
  @Prop({ required: false })
  description: string;

  @ApiProperty({
    description: 'Difficulty from 1 to 5',
    example: 3,
  })
  @Prop({ required: true })
  difficulty: number;

  @ApiProperty({
    description: 'Sequence of musical notes required to complete this sublevel',
    example: [
      { type: 'note', note: 'do', duration: 'short' },
      { type: 'note', note: 're', duration: 'short' },
      { type: 'chord', notes: ['do', 'mi'], duration: 'long' }
    ],
  })
  @Prop({ type: [{
    type: { type: String, enum: ['note', 'chord'], required: true },
    note: { type: String },
    notes: { type: [String] },
    duration: { type: String, enum: ['short', 'medium', 'long', 'very_long'] }
  }], required: true })
  notes: any[];

  @ApiProperty({
    description: 'Maximum stars that can be earned',
    example: 3,
  })
  @Prop({ required: true, default: 3 })
  maxStars: number;

  @ApiProperty({
    description: 'Global stars required to unlock this sublevel',
    example: 6,
  })
  @Prop({ required: true })
  requiredStars: number;

  @ApiProperty({
    description: 'Name of the track/music played',
    example: 'Spider Theme (Easy)',
    required: false,
  })
  @Prop()
  trackName: string;

  @ApiProperty({
    description: 'Background image URL',
    example: 'https://cdn.example.com/sublevels/bg1.png',
    required: false,
  })
  @Prop()
  backgroundUrl: string;

  @ApiProperty({
    description: 'Boss image URL (if any)',
    example: 'https://cdn.example.com/boss/vulture.png',
    required: false,
  })
  @Prop()
  bossUrl: string;

  @ApiProperty({
    description: 'Hero image URL (player ally)',
    example: 'https://cdn.example.com/heroes/spiderman.png',
    required: false,
  })
  @Prop()
  heroUrl: string;

  @ApiProperty({
    description: 'Audio file URL for the melody',
    example: 'https://cdn.example.com/audio/spider-track.mp3',
    required: false,
  })
  @Prop()
  trackUrl: string;
}

export type SublevelDocument = Sublevel & Document;
export const SublevelSchema = SchemaFactory.createForClass(Sublevel);
