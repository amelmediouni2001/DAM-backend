import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ValidateNoteDto {
  @IsNumber()
  @Min(200)
  @Max(600)
  frequency: number;

  @IsString()
  @IsNotEmpty()
  expectedNote: string; // The note that should be played (e.g., 'do', 're', 'mi')
}

export class ValidateNoteResponseDto {
  isCorrect: boolean;
  detectedNote: string;
  expectedNote: string;
  frequency: number;
  centsOff?: number; // How many cents sharp/flat (-50 to +50)
  message?: string;
}
