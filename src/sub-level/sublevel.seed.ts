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
    const level3 = await this.levelModel.findOne({ order: 3 });
    const level4 = await this.levelModel.findOne({ order: 4 });
    const level5 = await this.levelModel.findOne({ order: 5 });
    const level6 = await this.levelModel.findOne({ order: 6 });

    if (!level1 || !level2 || !level3 || !level4 || !level5 || !level6) {
      this.logger.error('❌ Missing one of levels 1–6. Cannot seed.');
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

    const level3Subs = [
  {
    levelId: level3._id,
    index: 1,
    title: 'Forest Breeze',
    description: 'Learn the soft Totoro intro notes: Do – Mi.',
    difficulty: 1,
    notes: ['do', 'mi'],
    maxStars: 3,
    requiredStars: 0,
    trackName: 'Totoro Intro - Breeze',
  },
  {
    levelId: level3._id,
    index: 2,
    title: 'Steps in the Woods',
    description: 'Add the playful step pattern: Do – Mi – Sol.',
    difficulty: 2,
    notes: ['do', 'mi', 'sol'],
    maxStars: 3,
    requiredStars: 3,
    trackName: 'Totoro Theme - Steps',
  },
  {
    levelId: level3._id,
    index: 3,
    title: 'Totoro Appears',
    description: 'Warm magical moment using Mi – Sol – La.',
    difficulty: 3,
    notes: ['mi', 'sol', 'la'],
    maxStars: 3,
    requiredStars: 6,
    trackName: 'Totoro Theme - Reveal',
  },
  {
    levelId: level3._id,
    index: 4,
    title: 'Forest Dance',
    description: 'The melody expands: Do – Sol – La – Sol.',
    difficulty: 4,
    notes: ['do', 'sol', 'la', 'sol'],
    maxStars: 3,
    requiredStars: 9,
    trackName: 'Totoro Theme - Dance',
  },
  {
    levelId: level3._id,
    index: 5,
    title: 'Catbus Ride!',
    description: 'Play the full cheerful Totoro sequence.',
    difficulty: 5,
    notes: ['do', 'mi', 'sol', 'la', 'sol', 'mi', 'do'],
    maxStars: 3,
    requiredStars: 12,
    trackName: 'Totoro Theme - Full',
  },
];

const level4Subs = [
  {
    levelId: level4._id,
    index: 1,
    title: 'A New Adventure!',
    description: 'Start your Pokémon journey with Sol – La.',
    difficulty: 1,
    notes: ['sol', 'la'],
    maxStars: 3,
    requiredStars: 15,
    trackName: 'Pokemon Intro - Start',
  },
  {
    levelId: level4._id,
    index: 2,
    title: 'Trainer Route',
    description: 'Classic Pokémon route pattern: Sol – La – Si.',
    difficulty: 2,
    notes: ['sol', 'la', 'si'],
    maxStars: 3,
    requiredStars: 18,
    trackName: 'Pokemon Route',
  },
  {
    levelId: level4._id,
    index: 3,
    title: 'Battle Prep!',
    description: 'Battle buildup melody: La – Si – Do – Ré.',
    difficulty: 3,
    notes: ['la', 'si', 'do', 'ré'],
    maxStars: 3,
    requiredStars: 21,
    trackName: 'Pokemon Battle Intro',
  },
  {
    levelId: level4._id,
    index: 4,
    title: 'Wild Encounter!',
    description: 'Fast Pokémon feel: Sol – Ré – Do – Ré – Sol.',
    difficulty: 4,
    notes: ['sol', 'ré', 'do', 'ré', 'sol'],
    maxStars: 3,
    requiredStars: 24,
    trackName: 'Pokemon Wild Battle',
  },
  {
    levelId: level4._id,
    index: 5,
    title: 'Gym Leader Challenge!',
    description: 'The full Pokémon hero phrase!',
    difficulty: 5,
    notes: ['sol', 'la', 'si', 'do', 'ré', 'si', 'sol'],
    maxStars: 3,
    requiredStars: 27,
    trackName: 'Pokemon Gym Leader',
  },
];

const level5Subs = [
  {
    levelId: level5._id,
    index: 1,
    title: 'Suit Up!',
    description: 'Start with Iron Man’s heavy tones: Mi – Do.',
    difficulty: 1,
    notes: ['mi', 'do'],
    maxStars: 3,
    requiredStars: 30,
    trackName: 'Iron Man Intro',
  },
  {
    levelId: level5._id,
    index: 2,
    title: 'Avengers Signal',
    description: 'Captain America’s heroic rise: Do – Ré – Mi.',
    difficulty: 2,
    notes: ['do', 'ré', 'mi'],
    maxStars: 3,
    requiredStars: 33,
    trackName: 'Captain America Rise',
  },
  {
    levelId: level5._id,
    index: 3,
    title: 'Flash Speed Run!',
    description: 'Fast sequence inspired by Flash.',
    difficulty: 3,
    notes: ['mi', 'fa', 'sol', 'la', 'sol'],
    maxStars: 3,
    requiredStars: 36,
    trackName: 'Flash Sprint',
  },
  {
    levelId: level5._id,
    index: 4,
    title: 'Hero Combo',
    description: 'Combine Iron Man + Cap motifs.',
    difficulty: 4,
    notes: ['mi', 'do', 'ré', 'mi', 'sol'],
    maxStars: 3,
    requiredStars: 39,
    trackName: 'Avengers Combined',
  },
  {
    levelId: level5._id,
    index: 5,
    title: 'Avengers Assemble!',
    description: 'Final epic theme combining all heroes.',
    difficulty: 5,
    notes: ['do', 'mi', 'sol', 'la', 'sol', 'mi', 'ré', 'do'],
    maxStars: 3,
    requiredStars: 42,
    trackName: 'Avengers Final Theme',
  },
];

const level6Subs = [
  {
    levelId: level6._id,
    index: 1,
    title: 'Hunter’s Beginning',
    description: 'Simple uplifting start: Mi – Fa.',
    difficulty: 1,
    notes: ['mi', 'fa'],
    maxStars: 3,
    requiredStars: 45,
    trackName: 'HxH Intro - Start',
  },
  {
    levelId: level6._id,
    index: 2,
    title: 'Gon’s Theme',
    description: 'Bright ascending pattern: Mi – Fa – Sol.',
    difficulty: 2,
    notes: ['mi', 'fa', 'sol'],
    maxStars: 3,
    requiredStars: 48,
    trackName: 'HxH Gon Theme',
  },
  {
    levelId: level6._id,
    index: 3,
    title: 'Killua’s Speed',
    description: 'Sharp fast Killua-inspired run.',
    difficulty: 3,
    notes: ['sol', 'la', 'si', 'la'],
    maxStars: 3,
    requiredStars: 51,
    trackName: 'HxH Killua Run',
  },
  {
    levelId: level6._id,
    index: 4,
    title: 'Hunter License Test',
    description: 'Longer pattern testing accuracy.',
    difficulty: 4,
    notes: ['mi', 'sol', 'la', 'si', 'sol'],
    maxStars: 3,
    requiredStars: 54,
    trackName: 'HxH Challenge',
  },
  {
    levelId: level6._id,
    index: 5,
    title: 'Departure! (Full Melody)',
    description: 'Play the iconic HxH-style uplifting sequence.',
    difficulty: 5,
    notes: ['mi', 'fa', 'sol', 'la', 'sol', 'fa', 'mi', 'ré'],
    maxStars: 3,
    requiredStars: 57,
    trackName: 'HxH Departure Full',
  },
];


    // Insert everything
    await this.sublevelModel.insertMany([...level1Subs, ...level2Subs, ...level3Subs, ...level4Subs, ...level5Subs, ...level6Subs]);

        console.log('🌱 Sublevels seeded successfully!');
  }
}
