import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PlayHistoryService } from './play-history.service';
import { CreatePlayHistoryDto } from './dto/create-play-history.dto';

@ApiTags('Play History')
@Controller('play-history')
export class PlayHistoryController {
  constructor(private readonly service: PlayHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new play history entry' })
  @ApiResponse({ status: 201, description: 'History saved' })
  async create(@Body() dto: CreatePlayHistoryDto) {
    return this.service.saveHistory(dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'List recent history entries for a user' })
  @ApiResponse({ status: 200, description: 'Play history list' })
  @ApiQuery({ name: 'levelId', required: false, description: 'Optional level filter' })
  async findAll(
    @Param('userId') userId: string,
    @Query('levelId') levelId?: string,
  ) {
    return this.service.getHistoryForUser(userId, levelId);
  }
}
