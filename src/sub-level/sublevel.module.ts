import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {SublevelsService} from './sublevel.service';
import {SublevelsController} from './sublevel.controller';
import {Sublevel, SublevelSchema} from './schema/sublevel.schema';
import { SublevelSeeder } from './sublevel.seed';

import { LevelsModule } from 'levels/levels.module';


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Sublevel.name, schema: SublevelSchema},
        ]),
        LevelsModule,
    ],
    controllers: [SublevelsController],
    providers: [SublevelsService, SublevelSeeder],
    exports: [SublevelsService, SublevelSeeder],
})

export class SublevelsModule {}