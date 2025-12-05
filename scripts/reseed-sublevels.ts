import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SublevelSeeder } from '../src/sub-level/sublevel.seed';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sublevel, SublevelDocument } from '../src/sub-level/schema/sublevel.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const sublevelModel = app.get<Model<SublevelDocument>>('SublevelModel');
  const seeder = app.get(SublevelSeeder);

  console.log('🗑️  Clearing existing sublevels...');
  await sublevelModel.deleteMany({});
  console.log('✅ Sublevels cleared!');

  console.log('🌱 Reseeding sublevels...');
  await seeder.seed();
  console.log('✅ Sublevels reseeded!');

  await app.close();
  process.exit(0);
}

bootstrap();
