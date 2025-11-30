// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files (audio, images) from public directory
  const express = await import('express');
  app.use('/audio', express.static('public/audio'));
  app.use('/images', express.static('public/images'));

  // Enable CORS for Android emulator and local development
  app.enableCors({
    origin: true, // Allow all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Piano Learning Game API')
    .setDescription('Backend API for Piano Learning Game with Avatar System (HMAC Auth)')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Provider-ID',
        description: 'Google user ID (providerId)',
      },
      'provider-id',
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Auth-Token',
        description: 'HMAC-SHA256 signature',
      },
      'auth-token',
    )
    .addTag('Avatars', 'Avatar management and customization endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  await app.listen(3000, '0.0.0.0'); // Listen on all network interfaces
  console.log('✅ Server running on http://0.0.0.0:3000');
  console.log('🌐 Access from Android: http://192.168.1.103:3000');
  console.log('📚 Swagger documentation available at http://localhost:3000/api/docs');
}
bootstrap();