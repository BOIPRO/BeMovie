import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { MoviesModule } from './modules/movie/movies.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { SupabaseModule } from './common/supabase/supabase.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }),
  ThrottlerModule.forRoot([{
    name: 'short',
    ttl: 60000,
    limit: 100,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 1000,
  },
  ]),
    RedisModule, MoviesModule, DatabaseModule, AuthModule,CloudinaryModule,SupabaseModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
},
)
export class AppModule {
}
