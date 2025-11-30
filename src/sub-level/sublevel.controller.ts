import {
  Controller, Get, Post, Body, Param, Patch, Delete
} from '@nestjs/common';

import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody
} from '@nestjs/swagger';

import { SublevelsService } from './sublevel.service';
import { CreateSublevelDto } from './dto/create-sublevel.dto';
import { UpdateSublevelDto } from './dto/update-sublevel.dto';
import { Sublevel } from './schema/sublevel.schema';

@ApiTags('Sublevels')
@Controller('sublevels')
export class SublevelsController {
  constructor(private readonly service: SublevelsService) {}

  // -------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new sublevel' })
  @ApiBody({ type: CreateSublevelDto })
  @ApiResponse({
    status: 201,
    description: 'Sublevel created successfully.',
    type: Sublevel,
  })
  create(@Body() dto: CreateSublevelDto) {
    return this.service.create(dto);
  }

  // -------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all sublevels' })
  @ApiResponse({
    status: 200,
    description: 'List of all sublevels.',
    type: [Sublevel],
  })
  findAll() {
    return this.service.findAll();
  }

  // -------------------------------------------
  @Get('level/:levelId')
  @ApiOperation({ summary: 'Get sublevels of a specific level' })
  @ApiParam({
    name: 'levelId',
    description: 'Level ID',
    example: '678a91c25f099c0023cb542a',
  })
  @ApiResponse({
    status: 200,
    description: 'List of sublevels for the given level.',
    type: [Sublevel],
  })
  findByLevel(@Param('levelId') levelId: string) {
    return this.service.findByLevel(levelId);
  }

  // -------------------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a sublevel by its ID' })
  @ApiParam({ name: 'id', example: '679b123abc99e01f45b100c2' })
  @ApiResponse({
    status: 200,
    description: 'Sublevel found.',
    type: Sublevel,
  })
  @ApiResponse({
    status: 404,
    description: 'Sublevel not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // -------------------------------------------
  @Patch(':id')
  @ApiOperation({ summary: 'Update a sublevel' })
  @ApiParam({ name: 'id', example: '679b123abc99e01f45b100c2' })
  @ApiBody({ type: UpdateSublevelDto })
  @ApiResponse({
    status: 200,
    description: 'Sublevel updated.',
    type: Sublevel,
  })
  update(@Param('id') id: string, @Body() dto: UpdateSublevelDto) {
    return this.service.update(id, dto);
  }

  // -------------------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sublevel' })
  @ApiParam({ name: 'id', example: '679b123abc99e01f45b100c2' })
  @ApiResponse({
    status: 200,
    description: 'Sublevel deleted.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}