import { RedisService } from "../../common/redis/redis.service";
import { Model } from 'mongoose';
import { Anime } from "../schema/anime.schema";
export declare class MoviesService {
    private readonly redisService;
    private animeModel;
    constructor(redisService: RedisService, animeModel: Model<Anime>);
    private AnimeStrategies;
    getAnimeData(limit: number, type: string): Promise<Partial<Anime>[]>;
    getMultipleAnimeLists(limit: number, types: string[]): Promise<Record<string, any>>;
    findOneAnime(id: number): Promise<Partial<Anime>[]>;
    getPageAnimes(key: string, page: number, limit: number): Promise<{
        media: any[];
        totalPages: number;
    }>;
    getPage(page?: number, limit?: number): Promise<{
        media: any[];
        totalPages: number;
    }>;
    searchAnime(search?: string, page?: number, limit?: number): Promise<{
        media: any[];
        totalPages: number;
    }>;
    getTrailer(): Promise<void>;
}
