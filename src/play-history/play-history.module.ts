import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayHistoryController } from './play-history.controller';
import { PlayHistoryService } from './play-history.service';
import { PlayHistory, PlayHistorySchema } from './schemas/play-history.schema';
import { Level, LevelSchema } from '../levels/schemas/level.schema';
import { Sublevel, SublevelSchema } from '../sub-level/schema/sublevel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayHistory.name, schema: PlayHistorySchema },
      { name: Level.name, schema: LevelSchema },
      { name: Sublevel.name, schema: SublevelSchema },
    ]),
  ],
  controllers: [PlayHistoryController],
  providers: [PlayHistoryService],
  exports: [PlayHistoryService],
})
export class PlayHistoryModule {}
