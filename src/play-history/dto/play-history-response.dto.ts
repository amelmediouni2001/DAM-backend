import { ApiProperty } from '@nestjs/swagger';

export class PlayHistoryResponseDto {
  @ApiProperty({ description: 'Mongo ID of the history entry' })
  id: string;

  @ApiProperty({ description: 'User ID who played the level' })
  userId: string;

  @ApiProperty({ description: 'Level ID' })
  levelId: string;

  @ApiProperty({ description: 'Level title for UI display' })
  levelTitle: string;

  @ApiProperty({ description: 'Level theme (for visuals)' })
  levelTheme: string;

  @ApiProperty({ description: 'Sublevel ID' })
  sublevelId: string;

  @ApiProperty({ description: 'Sublevel title' })
  sublevelTitle?: string;

  @ApiProperty({ description: 'Recognized notes or sequence played by the user', type: [String] })
  notes: string[];

  @ApiProperty({ description: 'Duration per note (seconds)', type: [Number] })
  noteDurations: number[];

  @ApiProperty({ description: 'Full run duration in milliseconds' })
  durationMs: number;

  @ApiProperty({ description: 'Stars earned for this run' })
  stars: number;

  @ApiProperty({ description: 'If the run completed the sublevel' })
  completed: boolean;

  @ApiProperty({ description: 'Number of wrong notes detected' })
  wrongNotes: number;

  @ApiProperty({ description: 'Timestamp when the entry was created' })
  createdAt: Date;
}
