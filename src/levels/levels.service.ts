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
            // LEVEL 1 – BATMAN
            // ----------------------------
            {
                order: 1,
                title: 'Night of the Shadow Riddle',
                theme: 'Batman',
                story: `I'm Batman.

The Riddler hid a noisy machine in Gotham, and it’s making trouble.
I found it, but it only opens with a music puzzle.

That’s where you come in.

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
                mapPosition: { x: 0.08, y: 0.05 },
                islandImageUrl: "https://i.ibb.co/B2Ktpnpg/level-1.png",
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 2 – SPIDER-MAN
            // ----------------------------
            {
                order: 2,
                title: 'Web of Resonance',
                theme: 'Spider-Man',
                story: `Hey! Spider-Man here!

Vulture set up a sound machine that’s shaking the city.
I can’t break it without playing the right melody.

Think you can help?

I’ll keep the bad guy busy—
you play the notes and shut this thing off.

Let’s do this, hero!`,
                expectedNotes: ['sol', 'do', 'la', 'sol', 'fa', 'mi', 're', 'do'],
                difficulty: 3,
                backgroundUrl: "https://i.ibb.co/MxK9w3Kh/nyc.jpg",
                bossUrl: "https://i.ibb.co/BVR2MMw6/vulture.jpg",
                musicUrl: "https://i.ibb.co/.../spider.mp3",
                colorTheme: "#E53935",
                mapPosition: { x: 0.3, y: 0.15 },
                islandImageUrl: "https://i.ibb.co/rfbNcdqG/level-2.png",
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 3 – MY NEIGHBOR TOTORO
            // ----------------------------
            {
                order: 3,
                title: 'Forest of Whispers',
                theme: 'My Neighbor Totoro',
                story: `Totoro found a curious wooden box humming deep in the forest.

It only reacts to soft, gentle melodies—
the kind forest spirits love.

Play the tune with Totoro,
calm the magic inside,
and help restore peace to the woods.`,
                expectedNotes: ['do', 're', 'mi', 'sol', 'mi', 're'],
                difficulty: 2,
                backgroundUrl: "https://i.ibb.co/YBV8GHXB/ghibli-bg.png",
                bossUrl: "https://i.ibb.co/WpY0NrcL/ghibli-boss.png",
                musicUrl: "https://i.ibb.co/.../totoro.mp3",
                colorTheme: "#6DA67A",
                mapPosition: { x: 0.15, y: 0.12 },
                islandImageUrl: "https://i.ibb.co/B5Nc7Q8Q/level-3.png",
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 4 – POKÉMON
            // ----------------------------
            {
                order: 4,
                title: 'Melody of the Wild',
                theme: 'Pokémon',
                story: `A rare Pokémon triggered a strange sound device in the tall grass.

It won’t open unless the right tune is played—
like a Poké Flute melody.

Join Pikachu and help uncover what’s inside
before the wild Pokémon get restless!`,
                expectedNotes: ['mi', 'sol', 'la', 'sol', 'mi', 're'],
                difficulty: 3,
                backgroundUrl: "https://i.ibb.co/p6vQth7q/pokemon-bg.jpg",
                bossUrl: "https://i.ibb.co/v4L7gg9r/pokemon-boss.png",
                musicUrl: "https://i.ibb.co/.../pokemon.mp3",
                colorTheme: "#FFCB05",
                mapPosition: { x: 0.18, y: 0.18 },
                islandImageUrl: "https://i.ibb.co/tw702J13/level-4.png",
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 5 – MARVEL TRIO (Iron Man, Captain America, Flash)
            // ----------------------------
            {
                order: 5,
                title: 'Heroes in Harmony',
                theme: 'Marvel Heroes',
                story: `A runaway energy core is pulsing out of control!

Iron Man scanned it, Cap secured the area,
and Flash says there's only one way to stabilize it—
play the harmonic sequence it's reacting to.

Three heroes have your back.
Now play the melody and save the day!`,
                expectedNotes: ['sol', 'fa', 'mi', 're', 'mi', 'fa', 'sol'],
                difficulty: 4,
                backgroundUrl: "https://i.ibb.co/zTzhJ8s0/marvel-bg.jpg",
                bossUrl: "https://i.ibb.co/FkQ8Nk61/marvel-boss.png",
                musicUrl: "https://i.ibb.co/.../marvel.mp3",
                colorTheme: "#D32F2F",
                mapPosition: { x: 0.23, y: 0.20 },
                islandImageUrl: "https://i.ibb.co/qFyzc2Sj/level-5.png",
                nextLevelId: null
            },

            // ----------------------------
            // LEVEL 6 – HUNTER X HUNTER
            // ----------------------------
            {
                order: 6,
                title: 'Echoes of Nen',
                theme: 'Hunter x Hunter',
                story: `Gon and Killua found a mysterious device glowing with Nen energy.

It reacts to rhythm, not strength—
a puzzle only a sharp ear can solve.

Join them, play the melody,
and reveal the secret hidden inside.`,
                expectedNotes: ['re', 'fa', 'sol', 'la', 'sol', 'fa', 're'],
                difficulty: 4,
                backgroundUrl: "https://i.ibb.co/Kj2Btjtb/hxh-bg.png",
                bossUrl: "https://i.ibb.co/gZTY394g/hxh-boss.png",
                musicUrl: "https://i.ibb.co/.../hxh.mp3",
                colorTheme: "#4CAF50",
                mapPosition: { x: 0.28, y: 0.25 },
                islandImageUrl: "https://i.ibb.co/5xjvJPQP/level-6.png",
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
