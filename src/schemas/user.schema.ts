import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  password?: string; // Optional pour social login

  @Prop()
  name: string;

  @Prop()
  photoUrl?: string;

  @Prop({ type: String, enum: ['local', 'google', 'facebook'], default: 'local' })
  provider: string;

  @Prop()
  providerId?: string; // ID de l'utilisateur chez Google/Facebook

  // FIXED: Properly define isActive
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 1 })
  level: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index unique sur email
UserSchema.index({ email: 1 }, { unique: true });
// Index composite pour provider + providerId
UserSchema.index({ provider: 1, providerId: 1 });