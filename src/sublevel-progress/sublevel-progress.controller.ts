import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SublevelProgressService } from './sublevel-progress.service';
import { CreateSublevelProgressDto } from './dto/create-sublevel-progress.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sublevel Progress')
@Controller('sublevels/progress')
export class SublevelProgressController {
  constructor(private readonly service: SublevelProgressService) {}

  // CREATE OR UPDATE PROGRESS
  @Post()
  @ApiOperation({ summary: 'Create or update sublevel progress' })
  @ApiResponse({ status: 201, description: 'Progress saved successfully' })
  async save(@Body() dto: CreateSublevelProgressDto) {
    return this.service.saveProgress(dto);
  }

  // GET ALL SUBLEVELS WITH UNLOCK STATE
  @Get(':userId/:levelId')
  @ApiOperation({ summary: 'Get all sublevels enriched with unlock state & progress' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'levelId', description: 'Level ID' })
  @ApiResponse({ status: 200, description: 'List of sublevels with unlock state' })
  async getUserLevelData(
    @Param('userId') userId: string,
    @Param('levelId') levelId: string,
  ) {
    return this.service.getSublevelsForUser(userId, levelId);
  }
}
