import { Module } from '@nestjs/common';
import {  CrawlController, MoviesController } from './movies.controller';
import { MoviesService } from './services/movies.service';
import { HttpModule } from '@nestjs/axios';
import { MovieSyncService } from './services/movie.sync.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema,Movie } from './schema/movie.schema';
import { StreamService } from './services/stream.service';
@Module({
  imports : [HttpModule,
    MongooseModule.forFeature([
      {name : Movie.name, schema :MovieSchema}
    ]),
  ],
  controllers: [MoviesController,CrawlController],
  providers: [MoviesService,MovieSyncService,StreamService]
})
export class MoviesModule {}
