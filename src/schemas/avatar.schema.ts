import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvatarDocument = Avatar & Document;

// Sub-schema for Avatar customization
@Schema({ _id: false })
export class AvatarCustomization {
  @Prop({ type: String, enum: ['anime', 'cartoon', 'pixel', 'realistic'], default: 'anime' })
  style: string;

  // Character parts
  @Prop({ required: true })
  bodyType: string; // e.g., 'slim', 'round', 'athletic'

  @Prop({ required: true })
  skinTone: string; // e.g., 'light', 'medium', 'dark', 'brown'

  @Prop({ required: true })
  hairstyle: string; // e.g., 'short', 'long', 'curly', 'straight'

  @Prop({ required: true })
  hairColor: string; // e.g., 'black', 'brown', 'blonde', 'red'

  @Prop({ required: true })
  eyeStyle: string; // e.g., 'round', 'almond', 'cat', 'big'

  @Prop({ required: true })
  eyeColor: string; // e.g., 'blue', 'brown', 'green'

  @Prop()
  clothingType: string; // e.g., 'casual', 'formal', 'sporty'

  @Prop()
  clothingColor: string;

  @Prop()
  accessories: string[]; // e.g., ['glasses', 'hat', 'earrings']
}

export const AvatarCustomizationSchema = SchemaFactory.createForClass(AvatarCustomization);

// Main Avatar Schema
@Schema({ timestamps: true })
export class Avatar {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // Avatar name (e.g., "Luna", "Max")

  @Prop({ type: AvatarCustomizationSchema, required: true })
  customization: AvatarCustomization;

  @Prop({ default: true })
  isActive: boolean; // Is this the active avatar being used

  @Prop({ type: String, enum: ['happy', 'sad', 'excited', 'thinking', 'neutral'], default: 'happy' })
  expression: string;

  @Prop()
  avatarImageUrl: string; // URL to the generated avatar image

  @Prop({ default: 100 })
  energy: number; // Avatar energy (0-100) for gameplay

  @Prop({ default: 0 })
  experience: number; // XP gained by the avatar

  @Prop({ default: 0 })
  level: number; // Avatar level

  @Prop({ type: String, enum: ['idle', 'playing', 'celebrating', 'thinking'], default: 'idle' })
  state: string; // Current state during gameplay

  @Prop({
    type: {
      unlocked: [String], // List of unlocked outfit IDs
      equipped: String, // Currently equipped outfit ID
    },
    default: {
      unlocked: ['outfit_default'],
      equipped: 'outfit_default',
    },
  })
  outfits: {
    unlocked: string[];
    equipped: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);

// Create indices
AvatarSchema.index({ userId: 1 });
AvatarSchema.index({ userId: 1, isActive: 1 });
