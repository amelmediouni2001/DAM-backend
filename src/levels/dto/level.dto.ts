import { ApiProperty } from '@nestjs/swagger';

export class LevelDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  story: string;

  @ApiProperty({ type: [String] })
  expectedNotes: string[];

  @ApiProperty()
  difficulty: number;

  @ApiProperty({ required: false })
  backgroundUrl?: string;

  @ApiProperty({ required: false })
  bossUrl?: string;

  @ApiProperty({ required: false })
  musicUrl?: string;

  @ApiProperty()
  starsUnlocked: number;
}
