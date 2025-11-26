import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Avatar, AvatarDocument } from '../schemas/avatar.schema';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { GenerateAvatarFromPromptDto } from './dto/generate-avatar-prompt.dto';
import { GeminiService } from '../utils/gemini.util';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
    private geminiService: GeminiService,
  ) {}

  // Create a new avatar
  async create(userId: string, createAvatarDto: CreateAvatarDto): Promise<Avatar> {
    const objectId = new Types.ObjectId(userId);

    const newAvatar = new this.avatarModel({
      userId: objectId,
      ...createAvatarDto,
      energy: 100,
      experience: 0,
      level: 1,
      state: 'idle',
      expression: 'happy',
      outfits: {
        unlocked: ['outfit_default'],
        equipped: 'outfit_default',
      },
    });

    return newAvatar.save();
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
    const updated = await this.avatarModel.findByIdAndUpdate(avatarObjectId, { isActive: true }, { new: true });
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

    const updated = await this.avatarModel.findByIdAndUpdate(objectId, { expression }, { new: true });
    if (!updated) {
      throw new NotFoundException(`Avatar with ID ${avatarId} not found`);
    }
    return updated;
  }

  // Update avatar state during gameplay
  async updateState(avatarId: string, state: string): Promise<Avatar> {
    const objectId = new Types.ObjectId(avatarId);

    const updated = await this.avatarModel.findByIdAndUpdate(objectId, { state }, { new: true });
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

    const updated = await this.avatarModel.findByIdAndUpdate(objectId, { energy: newEnergy }, { new: true });
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

  // Generate AI avatar image using FAST image generation
  private generateAIAvatarImage(prompt: string, style: string, name: string): string {
    // Build CONCISE prompt for FASTER generation
    const enhancedPrompt = `${style} avatar, ${prompt}, cute chibi, colorful, simple background`;
    
    // FASTEST option: Use Pollinations.ai with optimized settings
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 100000);
    
    // Smaller size = MUCH faster generation (256x256 is 4x faster than 512x512!)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=256&height=256&seed=${seed}&enhance=false&nologo=true`;
    
    this.logger.log(`🎨 Fast AI avatar URL: ${imageUrl}`);
    this.logger.log(`📝 Prompt: "${enhancedPrompt}"`);
    this.logger.log(`⚡ Size: 256x256 (optimized for speed)`);
    this.logger.log(`🔢 Seed: ${seed}`);
    
    return imageUrl;
  }

  // Generate avatar PREVIEW from prompt using Gemini AI (does NOT save to database)
  async generateAvatarFromPrompt(
    userId: string,
    generateDto: GenerateAvatarFromPromptDto,
  ): Promise<{
    previewData: any;
    description: string;
    suggestedAttributes: any;
  }> {
    const objectId = new Types.ObjectId(userId);
    const style = generateDto.style || 'cartoon';

    // Run safety check and description generation in parallel for faster response
    const [safetyCheck, aiResponse] = await Promise.all([
      this.geminiService.validatePromptSafety(generateDto.prompt),
      this.geminiService.generateAvatarDescription(generateDto.prompt, style)
    ]);

    if (!safetyCheck.isSafe) {
      throw new BadRequestException(`Prompt is not appropriate: ${safetyCheck.reason}`);
    }

    // Generate REAL AI avatar image using Pollinations.ai
    const avatarImageUrl = this.generateAIAvatarImage(generateDto.prompt, style, generateDto.name);

    // Return preview data WITHOUT saving to database
    const previewData = {
      userId: objectId.toString(),
      name: generateDto.name,
      customization: {
        style: style,
        bodyType: aiResponse.suggestedAttributes.bodyType,
        skinTone: aiResponse.suggestedAttributes.skinTone,
        hairstyle: aiResponse.suggestedAttributes.hairstyle,
        hairColor: aiResponse.suggestedAttributes.hairColor,
        eyeStyle: aiResponse.suggestedAttributes.eyeStyle,
        eyeColor: aiResponse.suggestedAttributes.eyeColor,
        clothingType: aiResponse.suggestedAttributes.clothingType,
        clothingColor: aiResponse.suggestedAttributes.clothingColor,
        accessories: aiResponse.suggestedAttributes.accessories,
      },
      generationSource: 'gemini-ai',
      aiGeneratedDescription: aiResponse.description,
      avatarImageUrl: avatarImageUrl,
    };

    return {
      previewData,
      description: aiResponse.description,
      suggestedAttributes: aiResponse.suggestedAttributes,
    };
  }

  // Save AI-generated avatar to database (called after user approves preview)
  async saveAIAvatar(userId: string, previewData: any): Promise<Avatar> {
    const objectId = new Types.ObjectId(userId);

    const newAvatar = new this.avatarModel({
      userId: objectId,
      name: previewData.name,
      customization: previewData.customization,
      generationSource: previewData.generationSource,
      aiGeneratedDescription: previewData.aiGeneratedDescription,
      avatarImageUrl: previewData.avatarImageUrl,
      energy: 100,
      experience: 0,
      level: 1,
      state: 'idle',
      expression: 'happy',
      outfits: {
        unlocked: ['outfit_default'],
        equipped: 'outfit_default',
      },
    });

    return newAvatar.save();
  }
}
