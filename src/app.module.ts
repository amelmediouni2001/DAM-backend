import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { LevelsModule } from './levels/levels.module';
import { MusicModule } from './music/music.module';
import { SublevelsModule } from 'sub-level/sublevel.module';
import { SublevelSeeder } from './sub-level/sublevel.seed';
import { SublevelProgressModule } from 'sublevel-progress/sublevel-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AvatarModule,
    LevelsModule,
    MusicModule,
    SublevelsModule,
    SublevelProgressModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly sublevelSeeder: SublevelSeeder) {}

  async onModuleInit() {
    await this.sublevelSeeder.seed();
  }
}