import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsBoolean } from 'class-validator';

export class CreateSublevelProgressDto {
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @IsMongoId()
  levelId: string;

  @ApiProperty()
  @IsMongoId()
  sublevelId: string;

  @ApiProperty()
  @IsNumber()
  stars: number;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;
}
