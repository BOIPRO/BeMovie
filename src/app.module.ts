import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }),RedisModule, MoviesModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{
}
