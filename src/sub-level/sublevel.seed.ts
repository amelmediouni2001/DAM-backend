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
        notes: [
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
    ],
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
        notes: [
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
    ],
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
        notes: [
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
    ],
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
        notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'short' },
    ],
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
        notes: [
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'short' },
    ],
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
    title: 'Spider Swing Intro',
    description: 'Begin your spider swing! Quick tap Re, quick tap Fa, then hold La. Feel the web tension!',
    difficulty: 1,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 12,
    trackName: 'Spider-Man Theme - Intro',
  },
  {
    levelId: level2._id,
    index: 2,
    title: 'Mini Swing Pattern',
    description:
      'Tap Sol#, quick tap Fa, then hold Re. Feel the rhythm building!',
    difficulty: 2,
    notes: [
      { type: 'note', note: 'Sol#', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 15,
    trackName: 'Spider-Man Theme - Pattern',
  },
  {
    levelId: level2._id,
    index: 3,
    title: 'Spider Jump',
    description:
      'Quick taps! Re, Fa, La. Your spider sense is growing!',
    difficulty: 3,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
    ],
    maxStars: 3,
    requiredStars: 18,
    trackName: 'Spider-Man Theme - Jump',
  },
  {
    levelId: level2._id,
    index: 4,
    title: 'Heroic Riff',
    description:
      'Quick sequence! La#, La, Sol#, Fa. You are almost there!',
    difficulty: 4,
    notes: [
      { type: 'note', note: 'La#', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol#', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },

    ],
    maxStars: 3,
    requiredStars: 21,
    trackName: 'Spider-Man Theme - Heroic',
  },
  {
    levelId: level2._id,
    index: 5,
    title: 'Full Mini-Theme',
    description:
      'Play the complete Spider-Man melody! Re-Fa-La(long), Sol#-Fa-Re(long), Re-Fa-La-La#-La-Sol#-Fa-Re(long). You are the hero now!',
    difficulty: 5,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol#', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La#', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'Sol#', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 24,
    trackName: 'Spider-Man Theme - Full',
  },
];

  // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 3 : conan
    // -----------------------------------------
 const level3Subs = [
  {
    levelId: level3._id,
    index: 1,
    title: 'The First Clue',
    description: `Conan found a device that reacts to Do - Mi. Let's inspect the melody.`,
    difficulty: 1,
    notes: [
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 0,
    trackName: 'Conan Case - Clue 1',
  },
  {
    levelId: level3._id,
    index: 2,
    title: 'Tracing the Evidence',
    description: 'The pattern grows: Do - Mi - Sol. A new piece of the puzzle appears.',
    difficulty: 2,
    notes: [
      { type: 'note', note: 'la#', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 3,
    trackName: 'Conan Investigation - Trail',
  },
  {
    levelId: level3._id,
    index: 3,
    title: 'Suspect Reveal',
    description: 'A key melody emerges using Mi - Sol - La. Something important is hidden here.',
    difficulty: 3,
    notes: [
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 6,
    trackName: 'Conan Theme - Reveal',
  },
  {
    levelId: level3._id,
    index: 4,
    title: 'Closing In',
    description: `The clue intensifies: Do - Sol - La - Sol. You're close to solving it!`,
    difficulty: 4,
    notes: [
      { type: 'note', note: 'la#', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'very_long' },
    ],
    maxStars: 3,
    requiredStars: 9,
    trackName: 'Conan Case - Chase',
  },
  {
    levelId: level3._id,
    index: 5,
    title: 'Case Solved!',
    description: 'Play the full sequence to crack the mystery and finish the case.',
    difficulty: 5,
    notes: [
      // Sublevel 1
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
      // Sublevel 2
      { type: 'note', note: 'la#', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
      // Sublevel 3
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'short' },
      { type: 'note', note: 're', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'long' },
      // Sublevel 4
      { type: 'note', note: 'la#', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'medium' },
      { type: 'note', note: 'fa', duration: 'medium' },
      { type: 'note', note: 'sol', duration: 'short' },
      { type: 'note', note: 'sol', duration: 'very_long' },
    ],
    maxStars: 3,
    requiredStars: 12,
    trackName: 'Conan Ending - Solution',
  },
];

  // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 4 : wakanda
    // -----------------------------------------

const level4Subs = [
  {
    levelId: level4._id,
    index: 1,
    title: 'Vibranium Pulse',
    description: 'Begin by stabilizing a small energy spark: Sol – La.',
    difficulty: 1,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
    ],
    maxStars: 3,
    requiredStars: 15,
    trackName: 'Wakanda Pulse - Intro',
  },
  {
    levelId: level4._id,
    index: 2,
    title: 'Wakandan Path',
    description: 'Feel the rhythm of Wakanda: Sol – La – Si.',
    difficulty: 2,
    notes: [
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 18,
    trackName: 'Wakanda Journey',
  },
  {
    levelId: level4._id,
    index: 3,
    title: 'Panther\'s Preparation',
    description: 'Energy rises: La – Si – Do – Ré. Prepare for the challenge.',
    difficulty: 3,
    notes: [
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
    ],
    maxStars: 3,
    requiredStars: 21,
    trackName: 'Panther Build-Up',
  },
  {
    levelId: level4._id,
    index: 4,
    title: 'Heart-Shaped Herb Vision',
    description: 'A powerful Wakandan echo: Sol – Ré – Do – Ré – Sol.',
    difficulty: 4,
    notes: [
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'very_long' },
    ],
    maxStars: 3,
    requiredStars: 24,
    trackName: 'Wakanda Vision',
  },
  {
    levelId: level4._id,
    index: 5,
    title: 'Warrior of Wakanda',
    description: 'Complete the full vibranium rhythm to protect Wakanda.',
    difficulty: 5,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'La', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'very_long' },
    ],
    maxStars: 3,
    requiredStars: 27,
    trackName: 'Black Panther Theme - Final',
  },
];

  // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 5 : Ronin Warriors
    // -----------------------------------------


const level5Subs = [
  {
    levelId: level5._id,
    index: 1,
    title: 'Path of the Blade',
    description: 'Begin with the ronin’s steady stance',
    difficulty: 1,
    notes: [
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 30,
    trackName: 'Path of the Blade',
  },
  {
    levelId: level5._id,
    index: 2,
    title: 'Call of Honor',
    description: 'A rising rhythm guided by discipline',
    difficulty: 2,
    notes: [
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 33,
    trackName: 'Call of Honor',
  },
  {
    levelId: level5._id,
    index: 3,
    title: 'Shadow Dash',
    description: 'A swift sequence like a silent strike.',
    difficulty: 3,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 36,
    trackName: 'Shadow Dash',
  },
  {
    levelId: level5._id,
    index: 4,
    title: 'Ronin Technique',
    description: 'Combine balance and precision into one flow.',
    difficulty: 4,
    notes: [
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 39,
    trackName: 'Ronin Technique',
  },
  {
    levelId: level5._id,
    index: 5,
    title: 'Way of the Ronin',
    description: 'The final form—master every rhythm of the warrior.',
    difficulty: 5,
    notes: [
      // Sublevel 1
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
      // Sublevel 2
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Sol', duration: 'long' },
      // Sublevel 3
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
      // Sublevel 4
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'long' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'short' },
      { type: 'note', note: 'Fa', duration: 'long' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 42,
    trackName: 'Way of the Ronin',
  },
];

  // -----------------------------------------
    // CREATE SUBLEVELS FOR LEVEL 6: hunter x hunter
    // -----------------------------------------

const level6Subs = [
  {
    levelId: level6._id,
    index: 1,
    title: 'Hunter\'s Beginning',
    description: 'Simple uplifting start: Mi – Fa.',
    difficulty: 1,
    notes: [
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'medium' },
    ],
    maxStars: 3,
    requiredStars: 45,
    trackName: 'HxH Intro - Start',
  },
  {
    levelId: level6._id,
    index: 2,
    title: 'Gon\'s Theme',
    description: 'Bright ascending pattern: Mi – Fa – Sol.',
    difficulty: 2,
    notes: [
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'La', duration: 'long' },
    ],
    maxStars: 3,
    requiredStars: 48,
    trackName: 'HxH Gon Theme',
  },
  {
    levelId: level6._id,
    index: 3,
    title: 'Killua\'s Speed',
    description: 'Sharp fast Killua-inspired run.',
    difficulty: 3,
    notes: [
      { type: 'note', note: 'Sol', duration: 'medium' },
      { type: 'note', note: 'Fa', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'medium' },
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'medium' },
    ],
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
    notes: [
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'medium' },
      { type: 'note', note: 'Sol', duration: 'medium' },
      { type: 'note', note: 'La', duration: 'short' },
    ],
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
    notes: [
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'medium' },
      { type: 'note', note: 'Sol', duration: 'short' },
      { type: 'note', note: 'La', duration: 'long' },
      { type: 'note', note: 'Sol', duration: 'medium' },
      { type: 'note', note: 'Fa', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Re', duration: 'short' },
      { type: 'note', note: 'Do', duration: 'medium' },
      { type: 'note', note: 'Re', duration: 'medium' },
      { type: 'note', note: 'Mi', duration: 'medium' },
      { type: 'note', note: 'La', duration: 'short' },
      { type: 'note', note: 'La', duration: 'medium' },
      { type: 'note', note: 'Sol', duration: 'medium' },
      { type: 'note', note: 'La', duration: 'short' },
    ],
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
