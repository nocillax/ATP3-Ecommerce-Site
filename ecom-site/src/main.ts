import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SerializeInterceptor } from './interceptor/serialize.interceptor';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The API documentation for my Advanced Web Tech project')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const cookieParser = require('cookie-parser');

  SwaggerModule.setup('api', app, document);

  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  app.use(cookieParser());

  app.use(express.json());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Access images via http://localhost:3000/uploads/filename.jpg
  });

  // ✅ UN-COMMENT AND USE THIS CONFIGURATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators.
      transform: true, // Automatically transforms payloads to DTO instances.
      // By REMOVING 'forbidNonWhitelisted' here, the global pipe will no longer
      // throw an error for our FormData requests.
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalInterceptors(new SerializeInterceptor());

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
