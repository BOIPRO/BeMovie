import { Module } from '@nestjs/common';
import {  CrawlController, MoviesController } from './movies.controller';
import { MoviesService } from './services/movies.service';
import { HttpModule } from '@nestjs/axios';
import { BotService } from './services/bot.sync.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema,Movie } from './schema/movie.schema';
import { StreamService } from './services/stream.service';
import { Episode, EpsiodeSchema } from './schema/episode.schema';
@Module({
  imports : [HttpModule,
    MongooseModule.forFeature([
      {name : Movie.name, schema :MovieSchema},
      {name : Episode.name, schema : EpsiodeSchema}
    ]),
  ],
  controllers: [MoviesController,CrawlController],
  providers: [MoviesService,BotService,StreamService]
})
export class MoviesModule {}
