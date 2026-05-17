import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import {ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
  app.use(logger)
  app.useGlobalPipes(new ValidationPipe({
  transform: true,
}));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
