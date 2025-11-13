import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AvatarService } from './avatar.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { AvatarResponseDto } from './dto/avatar-response.dto';
import { HmacAuthGuard } from '../auth/hmac-auth.guard';

@ApiTags('Avatars')
@ApiHeader({
  name: 'X-Provider-ID',
  description: 'Google user ID (providerId)',
  required: true,
})
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'HMAC-SHA256 signature',
  required: true,
})
@UseGuards(HmacAuthGuard)
@Controller('api/avatars')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new avatar',
    description: 'Create a new avatar with customization options for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar created successfully',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async create(@Request() req, @Body() createAvatarDto: CreateAvatarDto) {
    return this.avatarService.create(String(req.user._id), createAvatarDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all avatars',
    description: 'Retrieve all avatars belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of avatars',
    type: [AvatarResponseDto],
  })
  async findAll(@Request() req) {
    return this.avatarService.findAllByUser(String(req.user._id));
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active avatar',
    description: 'Retrieve the currently active avatar of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Active avatar',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active avatar found',
  })
  async getActive(@Request() req) {
    return this.avatarService.findActiveAvatar(String(req.user._id));
  }

  @Get(':avatarId')
  @ApiOperation({
    summary: 'Get avatar by ID',
    description: 'Retrieve a specific avatar by its ID',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar found',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar not found',
  })
  async findOne(@Param('avatarId') avatarId: string) {
    return this.avatarService.findOne(avatarId);
  }

  @Put(':avatarId')
  @ApiOperation({
    summary: 'Update avatar',
    description: 'Update avatar details including customization and state',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar updated successfully',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar not found',
  })
  async update(
    @Param('avatarId') avatarId: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    return this.avatarService.update(avatarId, updateAvatarDto);
  }

  @Post(':avatarId/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set avatar as active',
    description: 'Set a specific avatar as the active avatar for the user',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID to activate',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar activated successfully',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar not found',
  })
  async setActive(@Request() req, @Param('avatarId') avatarId: string) {
    return this.avatarService.setActiveAvatar(String(req.user._id), avatarId);
  }

  @Delete(':avatarId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete avatar',
    description: 'Delete a specific avatar (must have at least one avatar)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete the only avatar',
  })
  async remove(@Request() req, @Param('avatarId') avatarId: string) {
    return this.avatarService.remove(avatarId, String(req.user._id));
  }

  // Gameplay-related endpoints

  @Put(':avatarId/expression')
  @ApiOperation({
    summary: 'Update avatar expression',
    description: 'Update the expression of the avatar (happy, sad, excited, thinking, neutral)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          enum: ['happy', 'sad', 'excited', 'thinking', 'neutral'],
          example: 'excited',
        },
      },
      required: ['expression'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Expression updated',
    type: AvatarResponseDto,
  })
  async updateExpression(
    @Param('avatarId') avatarId: string,
    @Body('expression') expression: string,
  ) {
    return this.avatarService.updateExpression(avatarId, expression);
  }

  @Put(':avatarId/state')
  @ApiOperation({
    summary: 'Update avatar state',
    description: 'Update the state of the avatar during gameplay (idle, playing, celebrating, thinking)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          enum: ['idle', 'playing', 'celebrating', 'thinking'],
          example: 'playing',
        },
      },
      required: ['state'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'State updated',
    type: AvatarResponseDto,
  })
  async updateState(@Param('avatarId') avatarId: string, @Body('state') state: string) {
    return this.avatarService.updateState(avatarId, state);
  }

  @Put(':avatarId/energy')
  @ApiOperation({
    summary: 'Update avatar energy',
    description: 'Add or subtract energy from the avatar (delta can be negative)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        energyDelta: {
          type: 'number',
          example: -10,
          description: 'Energy change (positive to add, negative to subtract)',
        },
      },
      required: ['energyDelta'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Energy updated',
    type: AvatarResponseDto,
  })
  async updateEnergy(
    @Param('avatarId') avatarId: string,
    @Body('energyDelta') energyDelta: number,
  ) {
    return this.avatarService.updateEnergy(avatarId, energyDelta);
  }

  @Post(':avatarId/experience')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add experience to avatar',
    description: 'Award experience points to the avatar and handle leveling',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        xpGain: {
          type: 'number',
          example: 50,
          description: 'Experience points to award',
        },
      },
      required: ['xpGain'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Experience added',
    type: AvatarResponseDto,
  })
  async addExperience(@Param('avatarId') avatarId: string, @Body('xpGain') xpGain: number) {
    return this.avatarService.addExperience(avatarId, xpGain);
  }

  @Get(':avatarId/stats')
  @ApiOperation({
    summary: 'Get avatar stats',
    description: 'Retrieve the stats of an avatar (level, experience, energy, outfits)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar stats',
    schema: {
      type: 'object',
      properties: {
        level: { type: 'number' },
        experience: { type: 'number' },
        energy: { type: 'number' },
        outfitsUnlocked: { type: 'number' },
      },
    },
  })
  async getStats(@Param('avatarId') avatarId: string) {
    return this.avatarService.getAvatarStats(avatarId);
  }

  // Outfit management

  @Post(':avatarId/outfits/:outfitId/equip')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Equip outfit',
    description: 'Equip an outfit on the avatar (must be unlocked first)',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiParam({
    name: 'outfitId',
    description: 'The outfit ID to equip',
  })
  @ApiResponse({
    status: 200,
    description: 'Outfit equipped',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Outfit not unlocked',
  })
  async equipOutfit(
    @Param('avatarId') avatarId: string,
    @Param('outfitId') outfitId: string,
  ) {
    return this.avatarService.equipOutfit(avatarId, outfitId);
  }

  @Post(':avatarId/outfits/:outfitId/unlock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unlock outfit',
    description: 'Unlock a new outfit for the avatar',
  })
  @ApiParam({
    name: 'avatarId',
    description: 'The avatar ID',
  })
  @ApiParam({
    name: 'outfitId',
    description: 'The outfit ID to unlock',
  })
  @ApiResponse({
    status: 200,
    description: 'Outfit unlocked',
    type: AvatarResponseDto,
  })
  async unlockOutfit(
    @Param('avatarId') avatarId: string,
    @Param('outfitId') outfitId: string,
  ) {
    return this.avatarService.unlockOutfit(avatarId, outfitId);
  }
}
