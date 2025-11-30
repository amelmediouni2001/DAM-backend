import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SublevelProgress,
  SublevelProgressDocument,
} from './schemas/sublevel-progress.schema';
import {
  Sublevel,
  SublevelDocument,
} from '../sub-level/schema/sublevel.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateSublevelProgressDto } from './dto/create-sublevel-progress.dto';

@Injectable()
export class SublevelProgressService {
  constructor(
    @InjectModel(SublevelProgress.name)
    private progressModel: Model<SublevelProgressDocument>,

    @InjectModel(Sublevel.name)
    private sublevelModel: Model<SublevelDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private toId(id: any): string {
    return id?.toString();
  }

  // -----------------------------------------------------
  // SAVE PROGRESS
  // -----------------------------------------------------
  async saveProgress(dto: CreateSublevelProgressDto) {
    const existing = await this.progressModel.findOne({
      userId: dto.userId,
      sublevelId: dto.sublevelId,
    });

    if (existing) {
      existing.score = Math.max(existing.score, dto.score);
      existing.stars = Math.max(existing.stars, dto.stars);
      existing.completed = existing.completed || dto.completed;
      await existing.save();
    } else {
      await this.progressModel.create(dto);
    }

    return this.getSublevelsForUser(dto.userId, dto.levelId);
  }

  // -----------------------------------------------------
  // GET SUBLEVELS WITH UNLOCK STATE (PATCH APPLIED)
  // -----------------------------------------------------
  async getSublevelsForUser(userId: string, levelId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // 1. Load all sublevels for this level
    const sublevels = await this.sublevelModel
      .find({ levelId })
      .sort({ index: 1 });

    // 2. Load ALL progress for this user (across all levels)
    const allProgress = await this.progressModel.find({ userId });

    // Build lookup map for quick access
    const progressMap = Object.fromEntries(
      allProgress.map((p) => [this.toId(p.sublevelId), p]),
    );

    // 3. Compute REAL global stars across ALL sublevels
    const globalStars = allProgress.reduce((sum, p) => sum + (p.stars || 0), 0);

    // 4. Compute new user.level based on global stars
    let newLevel = 1;
    if (globalStars >= 3) newLevel = 2;
    if (globalStars >= 6) newLevel = 3;
    if (globalStars >= 9) newLevel = 4;
    if (globalStars >= 12) newLevel = 5;
    if (globalStars >= 15) newLevel = 6;

    if (user.level !== newLevel) {
      user.level = newLevel;
      await user.save();
    }

    // 5. Enrich sublevels with unlock state
    let allCompleted = true;

    const enriched = sublevels.map((sub) => {
      const id = this.toId(sub._id);
      const subProgress = progressMap[id];
      const previousIndex = sub.index - 1;

      // (A) Required stars for this sublevel
      const hasRequiredStars = globalStars >= sub.requiredStars;

      // (B) Previous sublevel completed
      let previousCompleted = true;
      if (previousIndex >= 1) {
        const prev = sublevels.find((s) => s.index === previousIndex);
        if (prev) {
          const prevProgress = progressMap[this.toId(prev._id)];
          previousCompleted = !!prevProgress?.completed;
        }
      }

      const unlocked = hasRequiredStars && previousCompleted;

      if (!subProgress?.completed) allCompleted = false;

      return {
        ...sub.toObject(),
        unlocked,
        starsEarned: subProgress?.stars || 0,
        completed: subProgress?.completed || false,
        totalStars: globalStars,
        previousCompleted,
      };
    });

    return enriched;
  }
}