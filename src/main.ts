// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Android emulator
  app.enableCors({
    origin: ['http://localhost:3000', 'http://10.0.2.2:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();