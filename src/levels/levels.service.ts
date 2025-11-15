import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';
import { LevelProgress, LevelProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto'; 

interface UnlockedLevel {
  levelId: string;
  title: string;
  unlocked: boolean;
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
            title: 'Night of the Shadow Riddle',
            theme: 'Batman',
            story:
                'Batman needs your help to decode the Riddler’s sonic message on a Gotham rooftop.',
            expectedNotes: ['do', 'mi', 'sol', 'sol', 'fa', 're'],
            difficulty: 2,
            backgroundUrl: "https://yourcdn.com/batman_bg.png",
            bossUrl: "https://yourcdn.com/riddler.png",
            musicUrl: "https://yourcdn.com/batman_theme.mp3",
            starsUnlocked: 0,
            },
            {
            title: 'Web of Resonance',
            theme: 'Spider-Man',
            story:
                'Spider-Man must disable Vulture’s sonic device using precise musical frequencies.',
            expectedNotes: ['la', 'do', 're', 'fa', 'mi', 'mi'],
            difficulty: 3,
            backgroundUrl: "https://yourcdn.com/spiderman_bg.png",
            bossUrl: "https://yourcdn.com/vulture.png",
            musicUrl: "https://yourcdn.com/spiderman_theme.mp3",
            starsUnlocked: 0,
            },
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

    async getUnlockedLevels(userId: string) {
        // Fetch all levels
        const levels = await this.levelModel.find();

        // Fetch this user's progress
        const progress = await this.progressModel.find({ userId });

        // Map completed levels by levelId
        const completedByLevel: Record<string, boolean> = {};
        progress.forEach(p => {
            if (p.completed) {
            completedByLevel[p.levelId] = true;
            }
        });

        const result: UnlockedLevel[] = [];

        for (let i = 0; i < levels.length; i++) {
            const currentLevel = levels[i];

            if (i === 0) {
            result.push({
                levelId: currentLevel.id,  // <-- IMPORTANT
                title: currentLevel.title,
                unlocked: true
            });
            continue;
            }

            const previousLevel = levels[i - 1];

            const unlocked = completedByLevel[previousLevel.id] === true;

            result.push({
            levelId: currentLevel.id,    // <-- IMPORTANT
            title: currentLevel.title,
            unlocked
            });
        }

        return {
            userId,
            levels: result
        };
        }


    test() {
        return { message: 'Levels module still working!' };
    }
}
