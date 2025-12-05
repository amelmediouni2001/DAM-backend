import { 
  IsNotEmpty, IsNumber, IsString, IsArray, IsOptional 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSublevelDto {

  @ApiProperty({
    description: 'Parent Level ID',
    example: '678a91c25f099c0023cb542a',
  })
  @IsNotEmpty()
  @IsString()
  levelId: string;

  @ApiProperty({
    description: 'Index order inside level (1–5)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  index: number;

  @ApiProperty({
    description: 'Title of the sublevel',
    example: 'Discover the Notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description or goal of the sublevel',
    example: 'Learn the first 2 notes and feel the Batman vibe!',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Difficulty level (1–5)',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  difficulty: number;

  @ApiProperty({
    description: 'Sequence of musical notes',
    example: ['sol', 'la', 'si', 'do'],
  })
  @IsArray()
  notes: string[];

  @ApiProperty({
    description: 'Maximum obtainable stars (default: 3)',
    example: 3,
  })
  @IsNumber()
  maxStars: number;

  @ApiProperty({
    description: 'Global stars required to unlock sublevel',
    example: 6,
  })
  @IsNumber()
  requiredStars: number;

  @ApiProperty({ example: 'Batman Theme 1', required: false })
  @IsOptional()
  trackName?: string;

  @ApiProperty({ example: 'https://cdn/bg1.png', required: false })
  @IsOptional()
  backgroundUrl?: string;

  @ApiProperty({ example: 'https://cdn/boss.png', required: false })
  @IsOptional()
  bossUrl?: string;

  @ApiProperty({ example: 'https://cdn/hero.png', required: false })
  @IsOptional()
  heroUrl?: string;

  @ApiProperty({ example: 'https://cdn/audio/track.mp3', required: false })
  @IsOptional()
  trackUrl?: string;
}