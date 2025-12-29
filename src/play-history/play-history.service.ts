import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayHistoryDto } from './dto/create-play-history.dto';
import { PlayHistoryResponseDto } from './dto/play-history-response.dto';
import {
  PlayHistory,
  PlayHistoryDocument,
} from './schemas/play-history.schema';
import { Level, LevelDocument } from '../levels/schemas/level.schema';
import { Sublevel, SublevelDocument } from '../sub-level/schema/sublevel.schema';

@Injectable()
export class PlayHistoryService {
  constructor(
    @InjectModel(PlayHistory.name)
    private historyModel: Model<PlayHistoryDocument>,

    @InjectModel(Level.name)
    private levelModel: Model<LevelDocument>,

    @InjectModel(Sublevel.name)
    private sublevelModel: Model<SublevelDocument>,
  ) {}

  async saveHistory(dto: CreatePlayHistoryDto): Promise<PlayHistoryResponseDto> {
    const record = await this.historyModel.create(dto);
    const level = await this.levelModel.findById(record.levelId);
    const sublevel = await this.sublevelModel.findById(record.sublevelId);
    return this.mapToDto(record, level ?? undefined, sublevel ?? undefined);
  }

  async getHistoryForUser(userId: string, levelId?: string): Promise<PlayHistoryResponseDto[]> {
    const filter: Record<string, unknown> = { userId };
    if (levelId) filter.levelId = levelId;

    const records = await this.historyModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    const levelIds = [...new Set(records.map((record) => record.levelId.toString()))];
    const sublevelIds = [...new Set(records.map((record) => record.sublevelId.toString()))];

    const levelDocs = await this.levelModel.find({ _id: { $in: levelIds } }).exec();
    const sublevelDocs = await this.sublevelModel.find({ _id: { $in: sublevelIds } }).exec();

    const levelMap = new Map(levelDocs.map((level) => [level.id, level]));
    const sublevelMap = new Map(sublevelDocs.map((sub) => [sub.id, sub]));

    return records.map((record) =>
      this.mapToDto(
        record,
        levelMap.get(record.levelId.toString()) ?? undefined,
        sublevelMap.get(record.sublevelId.toString()) ?? undefined,
      ),
    );
  }

  private mapToDto(
    record: PlayHistoryDocument,
    level?: Level,
    sublevel?: Sublevel,
  ): PlayHistoryResponseDto {
    return {
      id: record.id,
      userId: record.userId,
      levelId: record.levelId,
      levelTitle: level?.title ?? 'Unknown Level',
      levelTheme: level?.theme ?? 'default',
      sublevelId: record.sublevelId,
      sublevelTitle: sublevel?.title,
      notes: record.notes,
      noteDurations: record.noteDurations,
      durationMs: record.durationMs,
      stars: record.stars,
      completed: record.completed,
      wrongNotes: record.wrongNotes,
      createdAt: record.createdAt,
    };
  }
}
