import { PartialType } from '@nestjs/mapped-types';
import { CreateSublevelDto } from './create-sublevel.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSublevelDto extends PartialType(CreateSublevelDto) {
  @ApiPropertyOptional()
  trackName?: string;
}