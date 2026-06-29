import { Module } from '@nestjs/common';
import {  CronJobController, MoviesController,WakeupTimeController } from './movies.controller';
import { MoviesService } from './services/movies.service';
import { HttpModule } from '@nestjs/axios';
import { BotService } from './services/bot.sync.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeSchema,Anime } from './schema/anime.schema';
import { MovieSchema,Movie } from './schema/movie.schema';
import { StreamService } from './services/stream.service';
import {DecryptService} from './services/decryptm3u8.service'
import { Episode, EpisodeSchema } from './schema/episode.schema';
@Module({
  imports : [HttpModule,
    MongooseModule.forFeature([
      {name : Anime.name, schema :AnimeSchema},
      {name : Episode.name, schema : EpisodeSchema},
      {name : Movie.name, schema : MovieSchema},
    ]),
  ],
  controllers: [MoviesController,CronJobController,WakeupTimeController],
  providers: [MoviesService,BotService,StreamService,DecryptService],
  exports : [DecryptService]
})
export class MoviesModule {}
