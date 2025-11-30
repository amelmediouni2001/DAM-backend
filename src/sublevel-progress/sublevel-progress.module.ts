import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SublevelProgressService } from './sublevel-progress.service';
import { SublevelProgressController } from './sublevel-progress.controller';

import { SublevelProgress, SublevelProgressSchema } from './schemas/sublevel-progress.schema';
import { Sublevel, SublevelSchema } from '../sub-level/schema/sublevel.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SublevelProgress.name, schema: SublevelProgressSchema },
      { name: Sublevel.name, schema: SublevelSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SublevelProgressController],
  providers: [SublevelProgressService],
  exports: [SublevelProgressService],   // <-- Important!
})
export class SublevelProgressModule {}
