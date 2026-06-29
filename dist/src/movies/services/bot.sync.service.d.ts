import { Model } from 'mongoose';
import { Episode } from "../schema/episode.schema";
import { Anime } from "../schema/anime.schema";
export declare class BotService {
    private episodeModel;
    private animeModel;
    private readonly logger;
    constructor(episodeModel: Model<Episode>, animeModel: Model<Anime>);
    saveEpisodeToDB(id: number, episodeResults: any): Promise<void>;
    saveProviderStatus(anilistId: any, status: any): Promise<void>;
    triggerBotCrawl(): Promise<any>;
}
