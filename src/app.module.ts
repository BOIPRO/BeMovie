import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { MoviesModule } from './movies/movies.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }),RedisModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
