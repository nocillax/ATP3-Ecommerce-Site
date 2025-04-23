import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 👈 STRIP unknown fields
      forbidNonWhitelisted: true, // 👈 THROW ERROR if extra fields are found
      transform: true, // 👈 TRANSFORM to DTO class
    }),
  );

  app.useGlobalInterceptors(new SerializeInterceptor());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
