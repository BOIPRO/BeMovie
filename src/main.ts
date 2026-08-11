import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const memoryUsage = process.memoryUsage();
  console.log(`Ứng dụng khởi tạo tốn: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB RAM`);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(logger)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
