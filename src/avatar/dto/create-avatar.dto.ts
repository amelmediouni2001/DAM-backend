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

  @ApiProperty({
    type: CreateAvatarCustomizationDto,
    description: 'Avatar customization details',
  })
  @ValidateNested()
  @Type(() => CreateAvatarCustomizationDto)
  customization: CreateAvatarCustomizationDto;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'URL to the avatar image',
  })
  @IsString()
  @IsOptional()
  avatarImageUrl?: string;
}
