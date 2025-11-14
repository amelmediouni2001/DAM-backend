import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Avatar, AvatarDocument } from '../schemas/avatar.schema';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarService {
  constructor(@InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>) {}

  // Create a new avatar
  async create(userId: string, createAvatarDto: CreateAvatarDto): Promise<Avatar> {
    const objectId = new Types.ObjectId(userId);

    // Check if user has any avatars
    const existingAvatars = await this.avatarModel.countDocuments({ userId: objectId });
    const isFirstAvatar = existingAvatars === 0;

    // If this is the first avatar or user wants to set as active, deactivate others
    if (isFirstAvatar) {
      await this.avatarModel.updateMany({ userId: objectId }, { isActive: false });
    }

    // Detect if this is a Ready Player Me avatar
    const isReadyPlayerMe = !!(
      createAvatarDto.readyPlayerMeId ||
      createAvatarDto.readyPlayerMeAvatarUrl ||
      createAvatarDto.readyPlayerMeThumbnailUrl
    );

    // Use Ready Player Me thumbnail as avatarImageUrl if provided
    let avatarImageUrl = createAvatarDto.avatarImageUrl;
    if (isReadyPlayerMe && !avatarImageUrl && createAvatarDto.readyPlayerMeThumbnailUrl) {
      avatarImageUrl = createAvatarDto.readyPlayerMeThumbnailUrl;
    }

    // Provide default customization for Ready Player Me avatars if not provided
    const customization = createAvatarDto.customization || (isReadyPlayerMe ? {
      style: 'realistic',
      bodyType: 'fullbody',
      skinTone: 'medium',
      hairstyle: 'short',
      hairColor: 'brown',
      eyeStyle: 'round',
      eyeColor: 'brown',
      clothingType: 'casual',
      clothingColor: 'blue',
      accessories: [],
    } : undefined);

    const newAvatar = new this.avatarModel({
      userId: objectId,
      name: createAvatarDto.name,
      customization: customization,
      avatarImageUrl: avatarImageUrl || '',
      // Ready Player Me specific fields
      readyPlayerMeId: createAvatarDto.readyPlayerMeId,
      readyPlayerMeAvatarUrl: createAvatarDto.readyPlayerMeAvatarUrl,
      readyPlayerMeGlbUrl: createAvatarDto.readyPlayerMeGlbUrl,
      readyPlayerMeThumbnailUrl: createAvatarDto.readyPlayerMeThumbnailUrl,
      isReadyPlayerMe: isReadyPlayerMe,
      energy: 100,
      experience: 0,
      level: 1,
      state: 'idle',
      expression: 'happy',
      outfits: {
        unlocked: ['outfit_default'],
        equipped: 'outfit_default',
      },
      isActive: isFirstAvatar, // First avatar is active by default
    });

    try {
      return await newAvatar.save();
    } catch (error) {
      console.error('Error creating avatar:', error);
      throw new BadRequestException(`Failed to create avatar: ${error.message}`);
    }
  }

  // Get all avatars for a user
  async findAllByUser(userId: string): Promise<Avatar[]> {
    const objectId = new Types.ObjectId(userId);
    return this.avatarModel.find({ userId: objectId }).sort({ createdAt: -1 });
  }

  // Get active avatar for a user
  async findActiveAvatar(userId: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(userId);
    const avatar = await this.avatarModel.findOne({
      userId: objectId,
      isActive: true,
    });

    if (!avatar) {
      throw new NotFoundException('No active avatar found for this user');
    }

    return avatar;
  }

  // Get avatar by ID
  async findOne(avatarId: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);
    const avatar = await this.avatarModel.findById(objectId);

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    return avatar;
  }

  // Update avatar details
  async update(avatarId: string, updateAvatarDto: UpdateAvatarDto): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);

    const avatar = await this.avatarModel.findByIdAndUpdate(objectId, updateAvatarDto, {
      new: true,
      runValidators: true,
    });

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    return avatar;
  }

  // Set avatar as active
  async setActiveAvatar(userId: string, avatarId: string): Promise<Avatar> {
    const userObjectId = new Types.ObjectId(userId);
    const avatarObjectId = new Types.ObjectId(avatarId);

    // Verify the avatar belongs to the user
    const avatar = await this.avatarModel.findOne({
      _id: avatarObjectId,
      userId: userObjectId,
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found or does not belong to this user');
    }

    // Deactivate all other avatars for this user
    await this.avatarModel.updateMany({ userId: userObjectId }, { isActive: false });

    // Activate the selected avatar
    const updated = await this.avatarModel.findByIdAndUpdate(
      avatarObjectId,
      { isActive: true },
      { new: true },
    );
    
    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    
    return updated;
  }

  // Delete avatar
  async remove(avatarId: string, userId: string): Promise<{ message: string }> {
    const objectId = new Types.ObjectId(avatarId);
    const userObjectId = new Types.ObjectId(userId);

    const avatar = await this.avatarModel.findOne({
      _id: objectId,
      userId: userObjectId,
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found or does not belong to this user');
    }

    // Prevent deletion of the only avatar
    const userAvatarCount = await this.avatarModel.countDocuments({ userId: userObjectId });
    if (userAvatarCount <= 1) {
      throw new BadRequestException('Cannot delete the only avatar. Create a new one first.');
    }

    // If this was the active avatar, make another one active
    if (avatar.isActive) {
      const nextAvatar = await this.avatarModel.findOne({
        userId: userObjectId,
        _id: { $ne: objectId },
      });
      if (nextAvatar) {
        nextAvatar.isActive = true;
        await nextAvatar.save();
      }
    }

    await this.avatarModel.findByIdAndDelete(objectId);
    return { message: 'Avatar deleted successfully' };
  }

  // Update avatar expression
  async updateExpression(avatarId: string, expression: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);

    const updated = await this.avatarModel.findByIdAndUpdate(
      objectId,
      { expression },
      { new: true },
    );
    
    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    
    return updated;
  }

  // Update avatar state during gameplay
  async updateState(avatarId: string, state: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);

    const updated = await this.avatarModel.findByIdAndUpdate(
      objectId,
      { state },
      { new: true },
    );
    
    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    
    return updated;
  }

  // Update avatar energy
  async updateEnergy(avatarId: string, energyDelta: number): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);
    const avatar = await this.avatarModel.findById(objectId);

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    let newEnergy = avatar.energy + energyDelta;
    newEnergy = Math.max(0, Math.min(100, newEnergy)); // Clamp between 0-100

    const updated = await this.avatarModel.findByIdAndUpdate(
      objectId,
      { energy: newEnergy },
      { new: true },
    );
    
    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    
    return updated;
  }

  // Add experience and handle leveling
  async addExperience(avatarId: string, xpGain: number): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);
    const avatar = await this.avatarModel.findById(objectId);

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    let newExperience = avatar.experience + xpGain;
    let newLevel = avatar.level;

    // Level up every 100 XP
    const xpPerLevel = 100;
    if (newExperience >= xpPerLevel) {
      newLevel = Math.floor(newExperience / xpPerLevel) + 1;
    }

    const updated = await this.avatarModel.findByIdAndUpdate(
      objectId,
      {
        experience: newExperience,
        level: newLevel,
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    
    return updated;
  }

  // Equip outfit
  async equipOutfit(avatarId: string, outfitId: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);
    const avatar = await this.avatarModel.findById(objectId);

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    if (!avatar.outfits.unlocked.includes(outfitId)) {
      throw new BadRequestException('This outfit has not been unlocked');
    }

    avatar.outfits.equipped = outfitId;
    return avatar.save();
  }

  // Unlock outfit
  async unlockOutfit(avatarId: string, outfitId: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);
    const avatar = await this.avatarModel.findById(objectId);

    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }

    if (!avatar.outfits.unlocked.includes(outfitId)) {
      avatar.outfits.unlocked.push(outfitId);
      return avatar.save();
    }

    return avatar;
  }

  // Get avatar stats
  async getAvatarStats(avatarId: string): Promise<{
    level: number;
    experience: number;
    energy: number;
    outfitsUnlocked: number;
  }> {
    const avatar = await this.findOne(avatarId);

    return {
      level: avatar.level,
      experience: avatar.experience,
      energy: avatar.energy,
      outfitsUnlocked: avatar.outfits.unlocked.length,
    };
  }
}