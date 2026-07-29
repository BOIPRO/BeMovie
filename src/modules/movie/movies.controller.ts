import { Controller, Get, ParseIntPipe, Query, Res, ValidationPipe,UseGuards } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { GetAnime } from './dto/get-anime.dto';
import { GetStreamQueryDto } from 'src/modules/movie/dto/get-stream-dto';
import { SearchAnime } from './dto/search-anime.dto';
import { StreamService } from './services/stream.service';
import type { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
@Controller('movies')
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService,
        private readonly streamService: StreamService
    ) { }
    @SkipThrottle({short : true})
    @Get('anime-pho-bien')
    async getPopularityAnimes(@Query(new ValidationPipe()) query: GetAnime) {
        const dataPage = await this.moviesService.getPopularityPageAnimes(query.page, query.limit)
        return dataPage
    }
     @SkipThrottle({short : true})
    @Get('anime-trong-nam')
    async getYearAnimes(@Query(new ValidationPipe()) query: GetAnime) {
        const dataPage = await this.moviesService.getYearPageAnimes(query.page, query.limit)
        return dataPage
    }
    @Get('search')
    async searchAnime(@Query(new ValidationPipe()) query: SearchAnime) {
        const data = await this.moviesService.searchAnime(query.s, query.page, query.limit);
        return data
    }
     @SkipThrottle({short : true})
    @Get('home')
    async getHomePage() {
        const limit = 10;
        return await this.moviesService.getMultipleAnimeLists(limit);
    }
     @SkipThrottle({short : true})
    @Get('episodes')
    async getAnimeEpisode(@Query('id', ParseIntPipe) id: number) {
        return await this.streamService.getAnimeEpisodes(id)
    }
     @SkipThrottle({short : true})
    @Get('info')
    async GetInfoAnime(@Query('id', ParseIntPipe) id: number) {
        return (await this.moviesService.findOneAnime(id))
    }
     @SkipThrottle({short : true})
    @Get('stream')
    async getStreamAnime(@Query() query: GetStreamQueryDto ,@Res() res: Response) {
        const data: any = await this.streamService.getStreamingLink(query.anilistId, query.episodeSlug, query.provider, query.server);
        const m3u8Content = typeof data === 'object' ? data.m3u8 : data;
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(m3u8Content);
    }
    @Get('suggest')
    async suggestAnime(@Query('q') query: string) {
        return await this.moviesService.suggestAnime(query);
    }
    @Get('sitemap')
    async getAllAnime() {
        return await this.moviesService.getAllAnimes()
    }
    @Get('test')
    async test () {
        return await this.moviesService.getBannerImage()
    }
}
@Controller('wakeuptime')
export class WakeupTimeController {
    @Get()
    async wakeuptime() {
        return "Success"
    }
}
