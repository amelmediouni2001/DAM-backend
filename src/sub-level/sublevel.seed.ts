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
    // CREATE SUBLEVELS FOR LEVEL 1 (BATMAN)
    // -----------------------------------------
    const level1Subs = [
      // Sublevel 1 — "Discover the Notes"
      {
        levelId: level1._id,
        index: 1,
        title: 'Discover the Notes',
        description: 'Learn the first 2 notes: La – Sol. Feel the Batman vibe!',
        difficulty: 1,
        notes: ['la', 'sol'],
        maxStars: 3,
        requiredStars: 0,
        trackName: 'Batman Theme - Intro',
      },
      // Sublevel 2 — "Mini Theme Build-Up"
      {
        levelId: level1._id,
        index: 2,
        title: 'Mini Theme Build-Up',
        description: 'Add the next note: La – Sol – Fa. Introduces the jump from Sol → Fa.',
        difficulty: 2,
        notes: ['la', 'sol', 'fa'],
        maxStars: 3,
        requiredStars: 1,
        trackName: 'Batman Theme - Pattern',
      },
      // Sublevel 3 — "Hero Descent"
      {
        levelId: level1._id,
        index: 3,
        title: 'Hero Descent',
        description: 'Introduce the descent to Ré: Fa – Ré. Short, simple, but feels heroic!',
        difficulty: 3,
        notes: ['fa', 'ré'],
        maxStars: 3,
        requiredStars: 3,
        trackName: 'Batman Theme - Drop',
      },
      // Sublevel 4 — "The Dramatic Moment"
      {
        levelId: level1._id,
        index: 4,
        title: 'The Dramatic Moment',
        description: 'Hold the dramatic long Batman notes: Ré — Ré — Do',
        difficulty: 4,
        notes: ['ré', 'ré', 'do'],
        maxStars: 3,
        requiredStars: 6,
        trackName: 'Batman Theme - Climax',
      },
      // Sublevel 5 — "Play the Hero!" (Full Melody)
      {
        levelId: level1._id,
        index: 5,
        title: 'Play the Hero!',
        description: 'Complete the full Batman phrase: La – Sol – Fa – Ré – Ré – Ré – Do',
        difficulty: 5,
        notes: ['la', 'sol', 'fa', 'ré', 'ré', 'ré', 'do'],
        maxStars: 3,
        requiredStars: 9,
        trackName: 'Batman Theme - Full',
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
