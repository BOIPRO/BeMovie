import { Controller, Get, ParseIntPipe, Query, Res, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { GetAnime } from '../common/dto/get-anime.dto';
import { GetStreamQueryDto } from 'src/common/dto/get-stream-dto';
import { SearchAnime } from '../common/dto/search-anime.dto';
import { GetTrendingAnime } from '../common/dto/get-trending-anime.dto';
import { StreamService } from './services/stream.service';
import type { Response } from 'express';
@Controller('movies')
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService,
        private readonly streamService: StreamService
    ) { }
    @Get('anime-pho-bien')
    async getAnimes(@Query(new ValidationPipe()) query: GetAnime) {
        const dataPage = await this.moviesService.getPopularityPageAnimes(`page-popularity:${query.page}`, query.page, query.limit)
        return dataPage
    }
    @Get('anime-trong-nam')
    async getYearAnimes(@Query(new ValidationPipe()) query: GetAnime) {
        const dataPage = await this.moviesService.getYearPageAnimes(`page-year:${query.page}`, query.page, query.limit)
        return dataPage
    }
    @Get('search')
    async searchAnime(@Query(new ValidationPipe()) query: SearchAnime) {
        const data = await this.moviesService.searchAnime(query.s, query.page, query.limit);
        return data
    }
    @Get('trending')
    async getTrendingAnime(@Query(new ValidationPipe()) query: GetTrendingAnime) {
        const dataTrending = await this.moviesService.getAnimeData(query.amount, 'trending');
        return dataTrending
    }
    @Get('home')
    async getHomePage() {
        const activeLists = ['banner', 'trending', 'popularity', 'animeOfTheYear'];
        const limit = 10;
        return await this.moviesService.getMultipleAnimeLists(limit, activeLists);
    }
    @Get('episodes')
    async getAnimeEpisode(@Query('id', ParseIntPipe) id: number) {
        return await this.streamService.getAnimeEpisodes(id)
    }
    @Get('info')
    async GetInfoAnime(@Query('id', ParseIntPipe) id: number) {
        return (await this.moviesService.findOneAnime(id))
    }
    @Get('stream')
    async getStreamAnime(@Query() query: GetStreamQueryDto ,@Res() res: Response) {
        const data: any = await this.streamService.getStreamingLink(query.anilistId, query.episodeSlug, query.provider, query.server);
        const m3u8Content = typeof data === 'object' ? data.m3u8 : data;

        // QUAN TRỌNG: Thiết lập Header
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Gửi chuỗi về như một file text
        return res.send(m3u8Content);
    }
    @Get('suggest')
    async suggestAnime(@Query('q') query: string) {
        return await this.moviesService.suggestAnime(query);
    }
}
@Controller('wakeuptime')
export class WakeupTimeController {
    @Get()
    async wakeuptime() {
        return "Success"
    }
}
