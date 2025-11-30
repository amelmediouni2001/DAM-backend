import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class SublevelProgress {
  @ApiProperty({
    description: 'User ID',
    example: '67a812dd05f12e002830f990'
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @ApiProperty({
    description: 'Level ID',
    example: '678a91c25f099c0023cb542a'
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Level', required: true })
  levelId: string;

  @ApiProperty({
    description: 'Sublevel ID',
    example: '678a91c25f099c0023cb542b'
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sublevel', required: true })
  sublevelId: string;

  @ApiProperty({
    description: 'Stars earned in this sublevel (0–3)',
    example: 2,
  })
  @Prop({ required: true, default: 0 })
  stars: number;

  @ApiProperty({
    description: 'Score achieved in this sublevel',
    example: 78
  })
  @Prop({ required: true, default: 0 })
  score: number;

  @ApiProperty({
    description: 'Whether the sublevel is completed at least once',
    example: true
  })
  @Prop({ required: true, default: false })
  completed: boolean;
}

export type SublevelProgressDocument = SublevelProgress & Document;
export const SublevelProgressSchema = SchemaFactory.createForClass(SublevelProgress);
