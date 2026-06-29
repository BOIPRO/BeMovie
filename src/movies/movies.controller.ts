import { Controller, Get, ParseIntPipe, Query, Res, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { BotService } from './services/bot.sync.service';
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
    @Get('page')
    async getAnimes(@Query(new ValidationPipe()) query: GetAnime) {
        const dataPage = await this.moviesService.getPageAnimes(`page:${query.page}`, query.page, query.limit)
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
    /**
     *  xEnvelop : response.headers['x-envelop'],
                xEdgeTag : response.headers['x-edge-tag'],
                xCacheNode : response.headers['x-cache-node'],
                xRequestTrace : response.headers['x-request-trace'],
                xProxyDigest : response.headers['x-proxy-digest']
     */
    async getStreamAnime(@Query() query: GetStreamQueryDto ,@Res() res: Response) {
        const data: any = await this.streamService.getStreamingLink(query.anilistId, query.episodeSlug, query.provider, query.server);
        const m3u8Content = typeof data === 'object' ? data.m3u8 : data;

        // QUAN TRỌNG: Thiết lập Header
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Gửi chuỗi về như một file text
        return res.send(m3u8Content);
    }
    @Get('test')
    async test() {
        // return await this.streamService.getM3u8FromApi('VXyCbbSh_eGth0246zBKPTGGUHf4YK10ZW358oEpxlskXxcZUL6lqW9oxSdDs6rSqDkALsyQq9c-38GVhOQeYhuMsIeIE1zvaD00G7y5Yn1yr8b7L6_5NCm7dltbSwb0');
        return await this.streamService.getTokenUser();
    }
}
@Controller('cronjob')
export class CronJobController {
    constructor(private botService: BotService) { }
    // @Get('metadata')
    // async GetMetadata() {
    //     this.botService.getMetadata();
    //     return "Success"
    // }
    @Get('update')
    async UpdateData() {
        this.botService.triggerBotCrawl();
        return "Success"
    }
}
@Controller('wakeuptime')
export class WakeupTimeController {
    @Get()
    async wakeuptime() {
        return "Success"
    }
}
