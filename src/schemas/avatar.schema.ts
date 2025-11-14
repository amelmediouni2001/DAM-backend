import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class AvatarCustomization {
  @Prop({ required: true, enum: ['anime', 'cartoon', 'pixel', 'realistic'] })
  style: string;

  @Prop({ required: true })
  bodyType: string;

  @Prop({ required: true })
  skinTone: string;

  @Prop({ required: true })
  hairstyle: string;

  @Prop({ required: true })
  hairColor: string;

  @Prop({ required: true })
  eyeStyle: string;

  @Prop({ required: true })
  eyeColor: string;

  @Prop()
  clothingType: string;

  @Prop()
  clothingColor: string;

  @Prop({ type: [String], default: [] })
  accessories: string[];
}

@Schema()
export class AvatarOutfits {
  @Prop({ type: [String], default: ['outfit_default'] })
  unlocked: string[];

  @Prop({ default: 'outfit_default' })
  equipped: string;
}

@Schema({ timestamps: true })
export class Avatar {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: AvatarCustomization, required: false })
  customization?: AvatarCustomization; // Optional for Ready Player Me avatars

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ 
    enum: ['happy', 'sad', 'excited', 'thinking', 'neutral'],
    default: 'happy'
  })
  expression: string;

  @Prop({ default: '' })
  avatarImageUrl: string; // URL to the generated avatar image (legacy or Ready Player Me thumbnail)

  // Ready Player Me specific fields
  @Prop()
  readyPlayerMeId?: string; // Ready Player Me avatar ID

  @Prop()
  readyPlayerMeAvatarUrl?: string; // Full Ready Player Me avatar URL

  @Prop()
  readyPlayerMeGlbUrl?: string; // Ready Player Me 3D model GLB URL

  @Prop()
  readyPlayerMeThumbnailUrl?: string; // Ready Player Me thumbnail/render URL

  @Prop({ default: false })
  isReadyPlayerMe?: boolean; // Flag to indicate if this is a Ready Player Me avatar

  @Prop({ default: 100, min: 0, max: 100 })
  energy: number;

  @Prop({ default: 0, min: 0 })
  experience: number;

  @Prop({ default: 1, min: 1 })
  level: number;

  @Prop({ 
    enum: ['idle', 'playing', 'celebrating', 'thinking'],
    default: 'idle'
  })
  state: string;

  @Prop({ type: AvatarOutfits, default: () => ({ unlocked: ['outfit_default'], equipped: 'outfit_default' }) })
  outfits: AvatarOutfits;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);

// Add indexes for better query performance
AvatarSchema.index({ userId: 1, isActive: 1 });
AvatarSchema.index({ userId: 1, createdAt: -1 });