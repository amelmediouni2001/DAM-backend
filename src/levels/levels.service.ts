import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';
import { LevelProgress, LevelProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto'; 
import { UnlockedLevelsResponseDto } from './dto/unlocked-level-response.dto';
import { SublevelProgress } from '../sublevel-progress/schemas/sublevel-progress.schema';


interface UnlockedLevel {
  levelId: string;
  title: string;
  theme: string;
  unlocked: boolean;
  starsUnlocked: number;
  backgroundUrl?: string;
  bossUrl?: string;
  musicUrl?: string;
}



@Injectable()
export class LevelsService implements OnModuleInit {
    private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    constructor(
    @InjectModel(Level.name)
    private levelModel: Model<LevelDocument>,

    @InjectModel(LevelProgress.name)
    private progressModel: Model<LevelProgressDocument>,

    @InjectModel(SublevelProgress.name)
    private readonly sublevelProgressModel: Model<SublevelProgress>,
    ) {}

    async onModuleInit() {
    const count = await this.levelModel.countDocuments();
    if (count === 0) {
        console.log('🌱 Seeding levels...');

        await this.levelModel.insertMany([
    // ------------------------------------------------
    // LEVEL 1 – BATMAN (Shadowy Island)
    // ------------------------------------------------
    {
        order: 1,
        title: 'Night of the Shadow Riddle',
        theme: 'Batman',
        story: `I'm Batman.

There's a strange machine in Gotham making lots of noise.
It only stops if we play the right notes together.

Don't worry — I'll guide you!
Ready to help me solve this puzzle?

Let’s play the melody and save the night!`,
        expectedNotes: ['la', 'sol', 'fa', 're', 're', 're', 'do'],
        difficulty: 3,
        backgroundUrl: "https://i.ibb.co/j95259by/gotham.jpg",
        musicUrl: "https://i.ibb.co/.../batman.mp3",
        previewAudioUrl: `${this.baseUrl}/audio/levels/batman-preview.mp3`,
        previewDuration: 12,
        autoPlayPreview: true,
        colorTheme: "#1A1A1A",
        mapPosition: { x: 0.20, y: 0.20 },
        islandImageUrl: "https://i.ibb.co/B2Ktpnpg/level-1.png",
        nextLevelId: null,
        bossUrl: "https://i.ibb.co/rKGZYmGt/batman.png"
        },

    // ------------------------------------------------
    // LEVEL 2 – SPIDER-MAN (City Rooftop Island)
    // ------------------------------------------------
    {
        order: 2,
        title: 'Melodies of the City',
        theme: 'Spider-Man',
        story: `Hey there! It's Spider-Man!

I found a device playing funny sounds across the city.
The only way to calm everything down is to play a melody.

Think you can help me?
Let’s swing into it and play the notes together!`,
        expectedNotes: ['sol', 'la', 'sol', 'do', 'fa', 'la', 'do'],
        difficulty: 3,
        backgroundUrl: "https://i.ibb.co/XXXXX/spiderman-bg.jpg",
        musicUrl: "https://i.ibb.co/XXXXX/spiderman.mp3",
        colorTheme: "#E53935",
        mapPosition: { x: 0.20, y: 0.50 },
        islandImageUrl: "https://i.ibb.co/rfbNcdqG/level-2.png",
        nextLevelId: null,
        bossUrl: "https://i.ibb.co/DD2rqv7N/spiderman.png"
    },

    // ------------------------------------------------
    // LEVEL 3 – MY NEIGHBOR TOTORO (Forest Island)
    // ------------------------------------------------
    {
    order: 3,
    title: 'The Case of the Hidden Melody',
    theme: 'Detective Conan',
    story: `A strange device was found at the scene of a mystery!

Conan examined it and discovered
that it only responds to a specific melody.

He needs your help to play the notes,
unlock the clue,
and solve the case together.

Ready, detective?`,
    expectedNotes: ['do', 'mi', 'sol', 'la', 'sol', 'mi', 'do'],
    difficulty: 2,
    backgroundUrl: "https://i.ibb.co/XXXXX/conan-bg.jpg",
    musicUrl: "https://i.ibb.co/XXXXX/conan.mp3",
    colorTheme: "#1E4BA3", // Conan blue
    mapPosition: { x: 0.20, y: 0.80 },
    islandImageUrl: "https://i.ibb.co/B5Nc7Q8Q/level-3.png",
    nextLevelId: null,
    bossUrl: "https://i.ibb.co/XXXXX/conan.png"
},

    // ------------------------------------------------
    // LEVEL 4 – POKÉMON (Adventure Plains Island)
    // ------------------------------------------------
    {
    order: 4,
    title: 'Vibranium Rhythm Challenge',
    theme: 'Black Panther',
    story: `Welcome to Wakanda!

A vibranium sound module has activated,
and its energy keeps rising.

To stabilize it, you must play
the correct sequence of notes.

T'Challa trusts you —
will you help protect Wakanda with music?`,
    expectedNotes: ['sol', 'la', 'si', 'do', 're', 'si', 'sol'],
    difficulty: 3,
    backgroundUrl: "https://i.ibb.co/XXXXX/blackpanther-bg.jpg",
    musicUrl: "https://i.ibb.co/XXXXX/blackpanther.mp3",
    colorTheme: "#5528FF", // Wakanda purple
    mapPosition: { x: 0.80, y: 0.20 },
    islandImageUrl: "https://i.ibb.co/tw702J13/level-4.png",
    nextLevelId: null,
    bossUrl: "https://i.ibb.co/XXXXX/blackpanther.png"
},

    // ------------------------------------------------
    // LEVEL 5 – AVENGERS HEROES (Iron Man + Cap + Flash)
    // ------------------------------------------------
    {
        order: 5,
        title: 'Heroes of Harmony',
        theme: 'Avengers Mix',
        story: `Welcome, young hero!

Some friendly heroes left a super melody here.
Iron Man, Captain America, and even The Flash
want you to try their musical patterns!

Each part feels strong, bright, and fast.

Ready to play like a hero?`,
        expectedNotes: ['mi', 'do', 're', 'mi', 'sol', 'la', 'sol'],
        difficulty: 4,
        backgroundUrl: "https://i.ibb.co/XXXXX/avengers-bg.jpg",
        musicUrl: "https://i.ibb.co/XXXXX/avengers.mp3",
        colorTheme: "#FF0000",
        mapPosition: { x: 0.80, y: 0.50 },
        islandImageUrl: "https://i.ibb.co/qFyzc2Sj/level-5.png",
        nextLevelId: null,
        bossUrl: "https://i.ibb.co/XrCqkHsv/ironman.png"
    },

    // ------------------------------------------------
    // LEVEL 6 – HUNTER × HUNTER (Rocky Adventure Island)
    // ------------------------------------------------
    {
        order: 6,
        title: 'Melody of Adventure',
        theme: 'Hunter x Hunter',
        story: `Hi friend!

This island holds a bright and exciting melody.
Gon and Killua love fast, cheerful notes —
and now it’s your turn to try them!

Let’s play together and keep the adventure going!`,
        expectedNotes: ['mi', 'fa', 'sol', 'la', 'sol', 'fa', 'mi', 're'],
        difficulty: 4,
        backgroundUrl: "https://i.ibb.co/XXXXX/hxh-bg.jpg",
        musicUrl: "https://i.ibb.co/XXXXX/hxh.mp3",
        colorTheme: "#4CAF50",
        mapPosition: { x: 0.80, y: 0.80 },
        islandImageUrl: "https://i.ibb.co/5xjvJPQP/level-6.png",
        nextLevelId: null,
        bossUrl: "https://i.ibb.co/jdkF9P4/hxh.png"
    }
]);

    console.log('🌱 Levels seeded successfully!');
    }
}


    async findOne(id: string) {
        return this.levelModel.findById(id);
    }

    async saveProgress(dto: CreateProgressDto) {
    const progress = new this.progressModel(dto);
    return progress.save();
    }

    async findAll() {
    return this.levelModel.find();
    }

    async getUnlockedLevels(userId: string): Promise<UnlockedLevelsResponseDto> {
    const levels = await this.levelModel.find().lean();
    const progressList = await this.progressModel.find({ userId }).lean();

    // Map user progress by levelId
    const progressByLevel: Record<string, number> = {};
    progressList.forEach(p => {
        progressByLevel[p.levelId] = Math.max(progressByLevel[p.levelId] || 0, p.stars || 0);
    });

    const result = levels.map((lvl, index) => {
        const levelId = lvl._id.toString();

        const isUnlocked =
        index === 0
            ? true
            : (progressByLevel[levels[index - 1]._id.toString()] ?? 0) > 0;

        return {
        levelId,
        title: lvl.title,
        theme: lvl.theme,
        unlocked: isUnlocked,
        starsUnlocked: progressByLevel[levelId] || 0, // ⬅ REAL PROGRESS
        backgroundUrl: lvl.backgroundUrl,
        bossUrl: lvl.bossUrl,
        musicUrl: lvl.musicUrl
        };
    });

    return {
        userId,
        levels: result
    };
    }

    async getUserTotalStars(userId: string) {
  // get every sublevel progress for every level
    const progress = await this.sublevelProgressModel.find({ userId });

    if (!progress || progress.length === 0) {
        return { totalStars: 0 };
    }

    const totalStars = progress.reduce((sum, s) => sum + (s.stars || 0), 0);

    return { totalStars };
    }




    test() {
        return { message: 'Levels module still working!' };
    }
}
