import { ApiProperty } from '@nestjs/swagger';
import { UnlockedLevelDto } from './unlocked-level.dto';

export class UnlockedLevelsResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [UnlockedLevelDto] })
  levels: UnlockedLevelDto[];
}
