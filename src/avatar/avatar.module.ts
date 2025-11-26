import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Avatar, AvatarSchema } from '../schemas/avatar.schema';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { AuthModule } from '../auth/auth.module';
import { GeminiService } from '../utils/gemini.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    AuthModule,
    ConfigModule,
  ],
  providers: [AvatarService, GeminiService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
