import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SerializeInterceptor } from './interceptor/serialize.interceptor';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 👈 STRIP unknown fields
      forbidNonWhitelisted: true, // 👈 THROW ERROR if extra fields are found
      transform: true, // 👈 TRANSFORM to DTO class
    }),
  );

  app.useGlobalInterceptors(new SerializeInterceptor());


  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
