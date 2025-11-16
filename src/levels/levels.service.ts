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
            story: 'Batman needs your help…',
            expectedNotes: ['do', 'mi', 'sol', 'sol', 'fa', 're'],
            difficulty: 2,
            backgroundUrl: "https://i.ibb.co/.../bat-bg.jpg",
            bossUrl: "https://i.ibb.co/.../riddler.png",
            musicUrl: "https://i.ibb.co/.../batman.mp3",
            colorTheme: "#1A1A1A",
            mapPosition: { x: 0.15, y: 0.30 },
            islandImageUrl: "https://i.ibb.co/.../island1.png",
            nextLevelId: null
        },
        {
            order: 2,
            title: 'Web of Resonance',
            theme: 'Spider-Man',
            story: 'Spider-Man must disable…',
            expectedNotes: ['la', 'do', 're', 'fa', 'mi', 'mi'],
            difficulty: 3,
            backgroundUrl: "https://i.ibb.co/.../spider-bg.jpg",
            bossUrl: "https://i.ibb.co/.../vulture.png",
            musicUrl: "https://i.ibb.co/.../spider.mp3",
            colorTheme: "#E53935",
            mapPosition: { x: 0.32, y: 0.48 },
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
    const progress = await this.progressModel.find({ userId }).lean();

    const completedByLevel: Record<string, boolean> = {};
    progress.forEach(p => {
        if (p.completed) {
        completedByLevel[p.levelId] = true;
        }
    });

    const result = levels.map((lvl, index) => {
        const unlocked =
        index === 0
            ? true
            : completedByLevel[levels[index - 1]._id.toString()] === true;

        return {
        levelId: lvl._id.toString(),
        title: lvl.title,
        theme: lvl.theme,
        unlocked,
        starsUnlocked: lvl.starsUnlocked,
        backgroundUrl: lvl.backgroundUrl,
        bossUrl: lvl.bossUrl,
        musicUrl: lvl.musicUrl,
        };
    });

    return {
        userId,
        levels: result,
    };
    }



    test() {
        return { message: 'Levels module still working!' };
    }
}
