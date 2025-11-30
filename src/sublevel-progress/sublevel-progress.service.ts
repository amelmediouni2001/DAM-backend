import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SublevelProgress, SublevelProgressDocument } from './schemas/sublevel-progress.schema';
import { Sublevel, SublevelDocument } from '../sub-level/schema/sublevel.schema';
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
  // GET SUBLEVELS WITH UNLOCK STATE
  // -----------------------------------------------------
  async getSublevelsForUser(userId: string, levelId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const globalStars = user.level || 0;

    const sublevels = await this.sublevelModel
      .find({ levelId })
      .sort({ index: 1 });

    const progress = await this.progressModel.find({ userId, levelId });

    const progressMap = Object.fromEntries(
      progress.map((p) => [this.toId(p.sublevelId), p])
    );

    let allCompleted = true;

    const enriched = sublevels.map((sub) => {
      const id = this.toId(sub._id);
      const subProgress = progressMap[id];
      const previousIndex = sub.index - 1;

      // -------- Condition A: Required Stars ----------
      const hasRequiredStars = globalStars >= sub.requiredStars;

      // -------- Condition B: Previous Sublevel Completed ----------
      let previousCompleted = true;
      if (previousIndex >= 1) {
        const prev = sublevels.find((s) => s.index === previousIndex);
        const prevId = prev ? this.toId(prev._id) : null;
        const prevProgress = prevId ? progressMap[prevId] : null;
        previousCompleted = !!prevProgress?.completed;
      }

      const unlocked = hasRequiredStars && previousCompleted;

      if (!subProgress?.completed) allCompleted = false;

      return {
        ...sub.toObject(),
        unlocked,
        stars: subProgress?.stars || 0,
        completed: subProgress?.completed || false,
      };
    });

    // Update user level if ALL sublevels completed
    if (allCompleted) {
      user.level = user.level + 1;
      await user.save();
    }

    return enriched;
  }
}
