import { IsString, IsArray, IsEnum, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvatarCustomizationDto {
  @ApiProperty({
    example: 'anime',
    description: 'Avatar style',
    enum: ['anime', 'cartoon', 'pixel', 'realistic'],
  })
  @IsEnum(['anime', 'cartoon', 'pixel', 'realistic'])
  style: string;

  @ApiProperty({
    example: 'slim',
    description: 'Body type of the avatar',
  })
  @IsString()
  bodyType: string;

  @ApiProperty({
    example: 'light',
    description: 'Skin tone of the avatar',
  })
  @IsString()
  skinTone: string;

  @ApiProperty({
    example: 'long',
    description: 'Hairstyle of the avatar',
  })
  @IsString()
  hairstyle: string;

  @ApiProperty({
    example: 'black',
    description: 'Hair color',
  })
  @IsString()
  hairColor: string;

  @ApiProperty({
    example: 'big',
    description: 'Eye style',
  })
  @IsString()
  eyeStyle: string;

  @ApiProperty({
    example: 'blue',
    description: 'Eye color',
  })
  @IsString()
  eyeColor: string;

  @ApiPropertyOptional({
    example: 'casual',
    description: 'Clothing type',
  })
  @IsString()
  @IsOptional()
  clothingType?: string;

  @ApiPropertyOptional({
    example: 'red',
    description: 'Clothing color',
  })
  @IsString()
  @IsOptional()
  clothingColor?: string;

  @ApiPropertyOptional({
    example: ['glasses', 'hat'],
    description: 'List of accessories',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accessories?: string[];
}

export class CreateAvatarDto {
  @ApiProperty({
    example: 'Luna',
    description: 'Name of the avatar',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: CreateAvatarCustomizationDto,
    description: 'Avatar customization details (optional for Ready Player Me avatars)',
  })
  @ValidateNested()
  @Type(() => CreateAvatarCustomizationDto)
  @IsOptional()
  customization?: CreateAvatarCustomizationDto;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'URL to the avatar image (legacy or Ready Player Me thumbnail)',
  })
  @IsString()
  @IsOptional()
  avatarImageUrl?: string;

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
