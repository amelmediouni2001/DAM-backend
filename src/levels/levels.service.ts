import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';
import { LevelProgress, LevelProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto'; 
import { UnlockedLevelsResponseDto } from './dto/unlocked-level-response.dto';

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
    constructor(
    @InjectModel(Level.name)
    private levelModel: Model<LevelDocument>,

    @InjectModel(LevelProgress.name)
    private progressModel: Model<LevelProgressDocument>,
    ) {}

    async onModuleInit() {
        const count = await this.levelModel.countDocuments();
        if (count === 0) {
        console.log('🌱 Seeding levels...');
        await this.levelModel.insertMany([
        {
            order: 1,
            title: 'Night of the Shadow Riddle',
            theme: 'Batman',
            story: 'The Riddler has planted a sonic bomb in Gotham! Help Batman disarm it by playing the correct Bat-Signal melody before time runs out!',
            expectedNotes: ['sol', 'sol', 'sol', 'mi', 'fa', 'sol', 'la'],
            difficulty: 2,
            backgroundUrl: "https://i.ibb.co/.../bat-bg.jpg",
            bossUrl: "https://i.ibb.co/.../riddler.png",
            musicUrl: "https://i.ibb.co/.../batman.mp3",
            colorTheme: "#1A1A1A",
            mapPosition: { x: 0.08, y: 0.05 },
            islandImageUrl: "https://i.ibb.co/.../island1.png",
            nextLevelId: null
        },
        {
            order: 2,
            title: 'Web of Resonance',
            theme: 'Spider-Man',
            story: 'Spider-Man must swing through the city and disable the Vulture\'s sonic disruptor! Play the Spider-Man theme to save New York!',
            expectedNotes: ['sol', 'do', 'la', 'sol', 'fa', 'mi', 're', 'do'],
            difficulty: 3,
            backgroundUrl: "https://i.ibb.co/.../spider-bg.jpg",
            bossUrl: "https://i.ibb.co/.../vulture.png",
            musicUrl: "https://i.ibb.co/.../spider.mp3",
            colorTheme: "#E53935",
            mapPosition: { x: 0.11, y: 0.07 },
            islandImageUrl: "https://i.ibb.co/.../island2.png",
            nextLevelId: null // will be replaced after insertion
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




    test() {
        return { message: 'Levels module still working!' };
    }
}
