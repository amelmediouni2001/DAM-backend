import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Level, LevelSchema } from './schemas/level.schema';
import { LevelProgress, LevelProgressSchema } from './schemas/progress.schema';
import { SublevelProgress, SublevelProgressSchema } from '../sublevel-progress/schemas/sublevel-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
  { name: Level.name, schema: LevelSchema },
  { name: LevelProgress.name, schema: LevelProgressSchema },
  { name: SublevelProgress.name, schema: SublevelProgressSchema },
]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [MongooseModule]
})
export class LevelsModule {}
