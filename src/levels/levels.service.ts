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
            // ----------------------------
            // LEVEL 1 – BATMAN (Upper-Left with Sailboat)
            // ----------------------------
            {
                order: 1,
                title: 'Night of the Shadow Riddle',
                theme: 'Batman',
                story: `I'm Batman.

The Riddler hid a noisy machine in Gotham, and it's making trouble.
I found it, but it only opens with a music puzzle.

That's where you come in.

Play the notes with me, one by one,
and together we'll shut this thing down.

Ready, partner?`,
                expectedNotes: ['la', 'sol', 'fa', 're', 're', 're', 'do'],
                difficulty: 3,
                backgroundUrl: "https://i.ibb.co/j95259by/gotham.jpg",
                bossUrl: "https://i.ibb.co/TjVHxYx/riddler.jpg",
                musicUrl: "https://i.ibb.co/.../batman.mp3",
                previewAudioUrl: "http://192.168.100.21:3000/audio/levels/batman-preview.mp3",
                previewDuration: 12,
                autoPlayPreview: true,
                colorTheme: "#1A1A1A",
                mapPosition: { x: 0.20, y: 0.20 }, // Upper-left quadrant
                islandImageUrl: "https://i.ibb.co/XXXXX/level-1-batman-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 2 – SUPERMAN (Middle-Left)
            // ----------------------------
            {
                order: 2,
                title: 'Truth, Justice, and Harmony',
                theme: 'Superman',
                story: `This is Superman!

A mysterious sound device has appeared in Metropolis,
and it's disrupting the city's peace.

Only the right melody can unlock its secrets.

With great power comes great responsibility—
help me play the tune and save the day!`,
                expectedNotes: ['sol', 'do', 'la', 'sol', 'fa', 'mi', 're', 'do'],
                difficulty: 3,
                backgroundUrl: "https://i.ibb.co/XXXXX/superman-bg.jpg", // TODO: Replace with imgbb URL
                bossUrl: "https://i.ibb.co/XXXXX/superman-boss.jpg", // TODO: Replace with imgbb URL
                musicUrl: "https://i.ibb.co/XXXXX/superman.mp3", // TODO: Replace with imgbb URL
                colorTheme: "#0066CC",
                mapPosition: { x: 0.20, y: 0.50 }, // Middle-left
                islandImageUrl: "https://i.ibb.co/XXXXX/level-2-superman-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 3 – SPIDER-MAN (Bottom-Left with Treasure Chest)
            // ----------------------------
            {
                order: 3,
                title: 'Web of Resonance',
                theme: 'Spider-Man',
                story: `Hey! Spider-Man here!

I found a treasure chest on this island,
but it's locked with a musical puzzle.

Vulture set up a sound machine that's shaking the city.
I can't break it without playing the right melody.

Think you can help?

I'll keep the bad guy busy—
you play the notes and unlock the treasure!

Let's do this, hero!`,
                expectedNotes: ['do', 're', 'mi', 'sol', 'mi', 're'],
                difficulty: 2,
                backgroundUrl: "https://i.ibb.co/XXXXX/spiderman-bg.jpg", // TODO: Replace with imgbb URL
                bossUrl: "https://i.ibb.co/XXXXX/spiderman-boss.jpg", // TODO: Replace with imgbb URL
                musicUrl: "https://i.ibb.co/XXXXX/spiderman.mp3", // TODO: Replace with imgbb URL
                colorTheme: "#E53935",
                mapPosition: { x: 0.20, y: 0.80 }, // Bottom-left quadrant
                islandImageUrl: "https://i.ibb.co/XXXXX/level-3-spiderman-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 4 – CAPTAIN AMERICA (Upper-Right with Palm Trees)
            // ----------------------------
            {
                order: 4,
                title: 'Shield of Melody',
                theme: 'Captain America',
                story: `Captain America here!

A strange device has appeared on this tropical island.
It only responds to the right musical sequence.

I can protect the innocent, but I need your help
to play the melody that unlocks this mystery.

Together, we can save the day!

Let's make music, soldier!`,
                expectedNotes: ['mi', 'sol', 'la', 'sol', 'mi', 're'],
                difficulty: 3,
                backgroundUrl: "https://i.ibb.co/XXXXX/captain-america-bg.jpg", // TODO: Replace with imgbb URL
                bossUrl: "https://i.ibb.co/XXXXX/captain-america-boss.jpg", // TODO: Replace with imgbb URL
                musicUrl: "https://i.ibb.co/XXXXX/captain-america.mp3", // TODO: Replace with imgbb URL
                colorTheme: "#003366",
                mapPosition: { x: 0.80, y: 0.20 }, // Upper-right quadrant
                islandImageUrl: "https://i.ibb.co/XXXXX/level-4-captain-america-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 5 – MAGICAL GIRL (Sailor Moon-like, Middle-Right)
            // ----------------------------
            {
                order: 5,
                title: 'Moonlight Melody',
                theme: 'Magical Girl',
                story: `In the name of the moon, I need your help!

A magical device has appeared on this island,
and it's calling for a special melody.

Only someone with a pure heart and musical talent
can unlock its power.

Will you help me play the right tune
and restore peace to this magical realm?

Let's fight for love and justice!`,
                expectedNotes: ['sol', 'fa', 'mi', 're', 'mi', 'fa', 'sol'],
                difficulty: 4,
                backgroundUrl: "https://i.ibb.co/XXXXX/magical-girl-bg.jpg", // TODO: Replace with imgbb URL
                bossUrl: "https://i.ibb.co/XXXXX/magical-girl-boss.jpg", // TODO: Replace with imgbb URL
                musicUrl: "https://i.ibb.co/XXXXX/magical-girl.mp3", // TODO: Replace with imgbb URL
                colorTheme: "#FF69B4",
                mapPosition: { x: 0.80, y: 0.50 }, // Middle-right (unchanged)
                islandImageUrl: "https://i.ibb.co/XXXXX/level-5-magical-girl-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 6 – PIRATE SHIP / ROCKY ISLAND (Bottom-Right)
            // ----------------------------
            {
                order: 6,
                title: 'Treasure of the High Seas',
                theme: 'Pirate',
                story: `Ahoy there, matey!

A pirate ship has sailed to this rocky island,
and we've discovered a mysterious musical treasure.

The sea monster in these waters won't let us pass
unless we play the right melody.

Join our crew, play the tune,
and help us claim the ultimate treasure!

Yo ho ho and a bottle of... music!`,
                expectedNotes: ['re', 'fa', 'sol', 'la', 'sol', 'fa', 're'],
                difficulty: 4,
                backgroundUrl: "https://i.ibb.co/XXXXX/pirate-bg.jpg", // TODO: Replace with imgbb URL
                bossUrl: "https://i.ibb.co/XXXXX/sea-monster-boss.jpg", // TODO: Replace with imgbb URL (the purple sea monster)
                musicUrl: "https://i.ibb.co/XXXXX/pirate.mp3", // TODO: Replace with imgbb URL
                colorTheme: "#8B4513",
                mapPosition: { x: 0.80, y: 0.80 }, // Bottom-right quadrant
                islandImageUrl: "https://i.ibb.co/XXXXX/level-6-pirate-island.png", // TODO: Replace with imgbb URL
                nextLevelId: null
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
