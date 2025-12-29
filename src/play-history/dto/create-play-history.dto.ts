import {
  IsMongoId,
  IsNumber,
  IsBoolean,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreatePlayHistoryDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  levelId: string;

  @IsMongoId()
  sublevelId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  notes: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  noteDurations: number[];

  @IsNumber()
  @IsPositive()
  durationMs: number;

  @IsNumber()
  stars: number;

  @IsBoolean()
  completed: boolean;

  @IsNumber()
  wrongNotes: number;
}
