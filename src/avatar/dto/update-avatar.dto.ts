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
}
