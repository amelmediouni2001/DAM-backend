import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Level } from '../../levels/schemas/level.schema';
import { Sublevel } from '../../sub-level/schema/sublevel.schema';
import { User } from '../../schemas/user.schema';

@Schema({ timestamps: true })
export class PlayHistory {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Level.name,
    required: true,
  })
  levelId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Sublevel.name,
    required: true,
  })
  sublevelId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: string;

  @Prop({ type: [String], required: true })
  notes: string[];

  @Prop({ type: [Number], required: true })
  noteDurations: number[];

  @Prop({ required: true })
  durationMs: number;

  @Prop({ required: true, default: 0 })
  stars: number;

  @Prop({ required: true, default: true })
  completed: boolean;

  @Prop({ required: true, default: 0 })
  wrongNotes: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type PlayHistoryDocument = PlayHistory & Document & { createdAt: Date; updatedAt: Date };
export const PlayHistorySchema = SchemaFactory.createForClass(PlayHistory);
