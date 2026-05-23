import { Controller, Get, ParseIntPipe, Query,ValidationPipe  } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { BotService } from './services/bot.sync.service';
import { GetAnime } from '../common/dto/get-anime.dto';
import { SearchAnime } from '../common/dto/search-anime.dto';
import { GetTrendingAnime } from '../common/dto/get-trending-anime.dto';
import { StreamService } from './services/stream.service';

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
    @Get('episodes')
    async getAnimeEpisode(@Query('id',ParseIntPipe) id : number) {
        return await this.streamService.getAnimeEpisodes(id)
    }
    @Get('info')
    async GetInfoAnime (@Query('id',ParseIntPipe) id : number) {
        return (await this.moviesService.findOneAnime(id))
    }
    @Get('stream')
    async getStreamAnime (@Query('anilistId',ParseIntPipe) anilistId  : number,@Query("episodeSlug") episodeSlug : string ) {
        const url : string =  (await this.streamService.getStreamingLink(anilistId,episodeSlug));
        return {url : url}
    }
}
@Controller('changeurl')
export class ChangeUrlController {
    constructor ( private streamService : StreamService ) {}
    @Get()
    async ChangeUrl() {
        await this.streamService.changeURL();
        return "Success"
    }
}
