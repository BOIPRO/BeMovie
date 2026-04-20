import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MovieSyncService } from './services/movie.sync.service';

@Controller('movies')
export class MoviesController {
    constructor (private readonly moviesService : MoviesService ) {}
    @Get('page')
    async getAnimes( @Query('page',ParseIntPipe) page: number, @Query('limit',ParseIntPipe) limit: number) {
       const dataPage = await this.moviesService.getPageAnimes(`page:${page}`,page,limit)
       return dataPage
    }
    @Get('search')
    async searchAnime(@Query('s') searchvalue : string,@Query('page',ParseIntPipe) pageNumber: number, @Query('limit',ParseIntPipe) limit : number) {
        const data = await this.moviesService.searchAnime(searchvalue,pageNumber,limit);
        return data
    }
    @Get('home') 
    async getDataHome(@Query('trending',ParseIntPipe) trendingValue: number) {
        const dataTrending = await this.moviesService.getTrendingAnimes('trending',trendingValue);
        const dataPage = await this.moviesService.getPageAnimes('page:1',1,30);
        return {
            trending : dataTrending,
            data : dataPage
        }
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
