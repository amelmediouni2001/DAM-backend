import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Sublevel, SublevelDocument } from './schema/sublevel.schema';
import { Level, LevelDocument } from '../levels/schemas/level.schema';

@Injectable()
export class SublevelSeeder {
  private readonly logger = new Logger(SublevelSeeder.name);

  constructor(
    @InjectModel(Sublevel.name)
    private sublevelModel: Model<SublevelDocument>,

    @InjectModel(Level.name)
    private levelModel: Model<LevelDocument>,
  ) {}

  async seed() {
    this.logger.log('🔄 Starting Sublevel Seed...');

    // -----------------------------------------
    // FIND LEVEL 1 AND LEVEL 2 BY ORDER
    // -----------------------------------------
    const level1 = await this.levelModel.findOne({ order: 1 });
    const level2 = await this.levelModel.findOne({ order: 2 });

    if (!level1 || !level2) {
      this.logger.error('❌ Level 1 or Level 2 not found. Cannot seed.');
      return;
    }

    // If already seeded → skip
    const existing = await this.sublevelModel.countDocuments();
    if (existing > 0) {
      this.logger.log('✔ Sublevels already exist. Skipping seed.');
      return;
    }

    // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 1
    // -----------------------------------------
    const level1Subs = [
      {
        levelId: level1._id,
        index: 1,
        difficulty: 1,
        notes: ['do', 're', 'mi'],
        maxStars: 3,
        requiredStars: 0,
        trackName: 'Level 1 - Easy Intro',
      },
      {
        levelId: level1._id,
        index: 2,
        difficulty: 2,
        notes: ['fa', 'sol', 'la', 'si'],
        maxStars: 3,
        requiredStars: 3,
        trackName: 'Level 1 - Melody A',
      },
      {
        levelId: level1._id,
        index: 3,
        difficulty: 3,
        notes: ['do', 'sol', 'do', 'fa'],
        maxStars: 3,
        requiredStars: 6,
        trackName: 'Level 1 - Melody B',
      },
      {
        levelId: level1._id,
        index: 4,
        difficulty: 4,
        notes: ['la', 'fa', 're', 'do', 'mi'],
        maxStars: 3,
        requiredStars: 9,
        trackName: 'Level 1 - Melody C',
      },
      {
        levelId: level1._id,
        index: 5,
        difficulty: 5,
        notes: ['do', 'mi', 'sol', 'do', 'sol', 'mi'],
        maxStars: 3,
        requiredStars: 12,
        trackName: 'Level 1 - Boss Theme',
      },
    ];

    // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 2
    // -----------------------------------------
    const level2Subs = [
      {
        levelId: level2._id,
        index: 1,
        difficulty: 1,
        notes: ['sol', 'la', 'sol'],
        maxStars: 3,
        requiredStars: 15,
        trackName: 'Level 2 - Easy Intro',
      },
      {
        levelId: level2._id,
        index: 2,
        difficulty: 2,
        notes: ['do', 'fa', 'la', 'do'],
        maxStars: 3,
        requiredStars: 18,
        trackName: 'Level 2 - Melody A',
      },
      {
        levelId: level2._id,
        index: 3,
        difficulty: 3,
        notes: ['si', 'sol', 'fa', 're'],
        maxStars: 3,
        requiredStars: 21,
        trackName: 'Level 2 - Melody B',
      },
      {
        levelId: level2._id,
        index: 4,
        difficulty: 4,
        notes: ['re', 'mi', 'fa', 'sol', 'la'],
        maxStars: 3,
        requiredStars: 24,
        trackName: 'Level 2 - Melody C',
      },
      {
        levelId: level2._id,
        index: 5,
        difficulty: 5,
        notes: ['do', 'do', 'sol', 'sol', 'la', 'la', 'sol'],
        maxStars: 3,
        requiredStars: 27,
        trackName: 'Level 2 - Boss Theme',
      },
    ];

    // Insert everything
    await this.sublevelModel.insertMany([...level1Subs, ...level2Subs]);

        console.log('🌱 Sublevels seeded successfully!');
  }
}
