import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateAvatarFromPromptDto {
  @ApiProperty({
    example: 'Naruto from anime',
    description: 'User prompt describing the avatar (e.g., character name, cartoon character, anime character)',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    example: 'Luna',
    description: 'Name for the avatar',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'anime',
    description: 'Preferred style for the avatar',
    enum: ['anime', 'cartoon', 'pixel', 'realistic'],
    default: 'cartoon',
  })
  @IsEnum(['anime', 'cartoon', 'pixel', 'realistic'])
  @IsOptional()
  style?: string;
}

export class AvatarGenerationResponseDto {
  @ApiProperty({
    description: 'Generated avatar ID',
  })
  avatarId: string;

  @ApiProperty({
    description: 'Avatar name',
  })
  name: string;

  @ApiProperty({
    description: 'Generated description from AI',
  })
  description: string;

  @ApiProperty({
    description: 'AI-generated description saved in avatar',
  })
  aiGeneratedDescription?: string;

  @ApiProperty({
    description: 'AI-suggested attributes for the avatar',
  })
  suggestedAttributes: {
    bodyType: string;
    skinTone: string;
    hairstyle: string;
    hairColor: string;
    eyeStyle: string;
    eyeColor: string;
    clothingType: string;
    clothingColor: string;
    accessories: string[];
  };

  @ApiProperty({
    description: 'Avatar image URL (if available)',
  })
  avatarImageUrl?: string;

  @ApiProperty({
    description: 'Generation source',
    enum: ['gemini-ai', 'ready-player-me'],
  })
  generationSource: string;
}
