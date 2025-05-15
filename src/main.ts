// src/main.ts (snippet)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Ensure uploads directory exists
  const uploadPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath);
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('Musiversal API')
    .setDescription('API for managing songs and album cover images')
    .setVersion('1.0')
    .addTag('songs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve the uploads directory statically at the '/uploads' route
  app.use('/uploads', require('express').static(uploadPath)); // using express static [oai_citation:19‡medium.com](https://medium.com/@ggluopeihai/nestjs-uploading-pictures-8f25f84ad31e#:~:text=async%20function%20bootstrap%28%29%20,bootstrap)

  // (Optional) use global validation pipe, enable CORS, etc.
  await app.listen(3000);
}
bootstrap();
