import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SerializeInterceptor } from './interceptor/serialize.interceptor';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The API documentation for my Advanced Web Tech project')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 👈 STRIP unknown fields
      forbidNonWhitelisted: true, // 👈 THROW ERROR if extra fields are found
      transform: true, // 👈 TRANSFORM to DTO class
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalInterceptors(new SerializeInterceptor());

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
