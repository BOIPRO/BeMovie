import { Controller, Get, Param, ParseIntPipe, Query,ValidationPipe  } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MovieSyncService } from './services/movie.sync.service';
import { GetAnime } from './dto/get-anime.dto';
import { SearchAnime } from './dto/search-anime.dto';
import { GetTrendingAnime } from './dto/get-trending-anime.dto';
import { StreamService } from './services/stream.service';
import { url } from 'inspector';

@Controller('movies')
export class MoviesController {
    constructor (
        private readonly moviesService : MoviesService,
        private readonly streamService : StreamService
    ) {}
    @Get('page')
    async getAnimes( @Query(new ValidationPipe()) query : GetAnime) {
       const dataPage = await this.moviesService.getPageAnimes(`page:${query.page}`,query.page,query.limit)
       return dataPage
    }
    @Get('search')
    async searchAnime(@Query(new ValidationPipe()) query : SearchAnime) {
        const data = await this.moviesService.searchAnime(query.s,query.page,query.limit);
        return data
    }
    @Get('trending')
    async getTrendingAnime(@Query(new ValidationPipe()) query : GetTrendingAnime  ) {
        const dataTrending = await this.moviesService.getTrendingAnimes('trending',query.amount);
        return dataTrending
    }
    @Get('info')
    async GetInfoAnime (@Query('id') id : string) {
        return await this.streamService.getAnimeEpisodes(id)
    }
    @Get('stream')
    async getStreamAnime (@Query('id') id : string) {
       return (await this.streamService.getStreamLinks("One-Piece-ep-5"));
    }
}
@Controller('crawl')
export class CrawlController {
    constructor ( private movieSyncService : MovieSyncService ) {}
    @Get()
    async CrawlAnime() {
        await this.movieSyncService.handleSync();
        return "Success"
    }
}
