import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateAvatarDto } from './create-avatar.dto';

export class UpdateAvatarDto extends PartialType(CreateAvatarDto) {
  @ApiPropertyOptional({
    example: 'happy',
    description: 'Expression of the avatar',
    enum: ['happy', 'sad', 'excited', 'thinking', 'neutral'],
  })
  @IsEnum(['happy', 'sad', 'excited', 'thinking', 'neutral'])
  @IsOptional()
  expression?: string;

  @ApiPropertyOptional({
    example: 75,
    description: 'Avatar energy level (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  energy?: number;

  @ApiPropertyOptional({
    example: 'idle',
    description: 'Current state of the avatar',
    enum: ['idle', 'playing', 'celebrating', 'thinking'],
  })
  @IsEnum(['idle', 'playing', 'celebrating', 'thinking'])
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this avatar is active',
  })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'outfit_premium',
    description: 'Currently equipped outfit ID',
  })
  @IsString()
  @IsOptional()
  equippedOutfit?: string;

  // Ready Player Me specific fields
  @ApiPropertyOptional({
    example: '64bfa15f0e72c63d7c3f5a5e',
    description: 'Ready Player Me avatar ID',
  })
  @IsString()
  @IsOptional()
  readyPlayerMeId?: string;

  @ApiPropertyOptional({
    example: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb',
    description: 'Ready Player Me full avatar URL',
  })
  @IsString()
  @IsOptional()
  readyPlayerMeAvatarUrl?: string;

  @ApiPropertyOptional({
    example: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb',
    description: 'Ready Player Me 3D model GLB URL',
  })
  @IsString()
  @IsOptional()
  readyPlayerMeGlbUrl?: string;

  @ApiPropertyOptional({
    example: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.png?scene=fullbody-portrait-v1',
    description: 'Ready Player Me thumbnail/render URL',
  })
  @IsString()
  @IsOptional()
  readyPlayerMeThumbnailUrl?: string;
}
