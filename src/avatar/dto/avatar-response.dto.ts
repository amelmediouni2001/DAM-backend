import { ApiProperty } from '@nestjs/swagger';

export class AvatarCustomizationResponseDto {
  @ApiProperty()
  style: string;

  @ApiProperty()
  bodyType: string;

  @ApiProperty()
  skinTone: string;

  @ApiProperty()
  hairstyle: string;

  @ApiProperty()
  hairColor: string;

  @ApiProperty()
  eyeStyle: string;

  @ApiProperty()
  eyeColor: string;

  @ApiProperty()
  clothingType: string;

  @ApiProperty()
  clothingColor: string;

  @ApiProperty()
  accessories: string[];
}

export class AvatarResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  customization?: AvatarCustomizationResponseDto;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  expression: string;

  @ApiProperty()
  avatarImageUrl: string;

  // Ready Player Me specific fields
  @ApiProperty({ required: false })
  readyPlayerMeId?: string;

  @ApiProperty({ required: false })
  readyPlayerMeAvatarUrl?: string;

  @ApiProperty({ required: false })
  readyPlayerMeGlbUrl?: string;

  @ApiProperty({ required: false })
  readyPlayerMeThumbnailUrl?: string;

  @ApiProperty({ required: false })
  isReadyPlayerMe?: boolean;

  @ApiProperty()
  energy: number;

  @ApiProperty()
  experience: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  state: string;

  @ApiProperty()
  outfits: {
    unlocked: string[];
    equipped: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
