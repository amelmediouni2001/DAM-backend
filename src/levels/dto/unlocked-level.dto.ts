import { ApiProperty } from '@nestjs/swagger';

export class UnlockedLevelDto {
  @ApiProperty()
  levelId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  unlocked: boolean;

  @ApiProperty()
  starsUnlocked: number;

  @ApiProperty({ required: false })
  backgroundUrl?: string;

  @ApiProperty({ required: false })
  bossUrl?: string;

  @ApiProperty({ required: false })
  musicUrl?: string;
}
