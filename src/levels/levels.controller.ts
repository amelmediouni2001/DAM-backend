import { Controller, Get, Body, Post } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

    @Get('test')
    test() {
        return this.levelsService.test();
    }

    @Post('progress')
    @ApiOperation({ summary: 'Save user progress for a level' })
    @ApiOkResponse({ description: 'Progress saved successfully' })
    async saveProgress(@Body() dto: CreateProgressDto) {
    return this.levelsService.saveProgress(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all levels' })
    @ApiOkResponse({ description: 'Returns all levels' })
    async getAllLevels() {
    return this.levelsService.findAll();
    }

}