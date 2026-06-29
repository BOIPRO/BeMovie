import { MoviesService } from './services/movies.service';
import { BotService } from './services/bot.sync.service';
import { GetAnime } from '../common/dto/get-anime.dto';
import { GetStreamQueryDto } from "../common/dto/get-stream-dto";
import { SearchAnime } from '../common/dto/search-anime.dto';
import { GetTrendingAnime } from '../common/dto/get-trending-anime.dto';
import { StreamService } from './services/stream.service';
import type { Response } from 'express';
export declare class MoviesController {
    private readonly moviesService;
    private readonly streamService;
    constructor(moviesService: MoviesService, streamService: StreamService);
    getAnimes(query: GetAnime): Promise<{
        media: any[];
        totalPages: number;
    }>;
    searchAnime(query: SearchAnime): Promise<{
        media: any[];
        totalPages: number;
    }>;
    getTrendingAnime(query: GetTrendingAnime): Promise<Partial<import("./schema/anime.schema").Anime>[]>;
    getHomePage(): Promise<Record<string, any>>;
    getAnimeEpisode(id: number): Promise<import("./services/stream.service").EpisodeAnime[]>;
    GetInfoAnime(id: number): Promise<Partial<import("./schema/anime.schema").Anime>[]>;
    getStreamAnime(query: GetStreamQueryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    test(): Promise<any>;
}
export declare class CronJobController {
    private botService;
    constructor(botService: BotService);
    UpdateData(): Promise<string>;
}
export declare class WakeupTimeController {
    wakeuptime(): Promise<string>;
}
