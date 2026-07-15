import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';
import { MoviesModule } from './modules/movie/movies.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
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
  MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // dùng cho port 465
      socketOptions: {
        family: 4,
    } ,
      requireTLS: true,
      tls: {
      rejectUnauthorized: false,
    },
      
      auth: {
        user: 'boibrohihi311@gmail.com',
        pass: process.env.APP_PASSWORD,
      },
    } as any,
    defaults: {
      from: '"BMovie App" <boibrohihi311@gmail.com>', // Cũng phải là email này
    },
    template: {
        adapter: new HandlebarsAdapter(),
      },
  }),
    RedisModule, MoviesModule, DatabaseModule, AuthModule],
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
