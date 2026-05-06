import { HttpException, HttpStatus, Injectable, NotFoundException, } from "@nestjs/common";
import { RedisService } from "src/common/redis/redis.service";
import { Episode } from "../schema/episode.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
export interface EpisodeAnime {
    anilistID : number,
    episodeNumber: string,
    episodeId: string,
    server: string,
    episodeSlug : string,
}

@Injectable()
export class StreamService {
    constructor(
        private readonly redisService: RedisService,
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
        private configService: ConfigService
    ) {}
    async getAnimeEpisodes(id: number) {
        const listEpsiode: EpisodeAnime[] = await this.episodeModel.find({ anilistId: id }).select("episodeSlug episodeNumber server")
        return listEpsiode
    }
    async getStreamingLink(anilistId:number,episodeSlug :string) {
        const filter = {
            $and : [
                {episodeSlug : episodeSlug},
                {anilistId : anilistId}
            ]
         }
          const [url] = await this.episodeModel.find(filter).select("url")
        return url
    }
}