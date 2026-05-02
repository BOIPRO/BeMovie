import { HttpException, HttpStatus, Injectable, NotFoundException, } from "@nestjs/common";
import { RedisService } from "src/common/redis/redis.service";
import { Episode } from "../schema/episode.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
export interface EpisodeAnime {
    episodeNumber: string,
    episodeId: string,
    server: string,
}
export interface AnimeMapperResponse {
    provider: string,
    limit: number,
    offset: number,
    total: number,
    hasNextPage: boolean,
    episodes: EpisodeAnime[],
}

@Injectable()
export class StreamService {
    constructor(
        private readonly redisService: RedisService,
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
        private configService: ConfigService
    ) { }
    private async saveToDB(id: number, epsiodes: EpisodeAnime[]) {
        try {
            const operations = (epsiodes.map((item) => {
                return {
                    updateOne: {
                        filter: {
                            episodeNumber: item.episodeNumber,
                             anilistId: id,
                        },
                        update: {
                            $set: {
                                episodeId: item.episodeId,
                                server: item.server,
                            },
                        },
                        upsert: true,
                    },
                }
            }));
            await this.episodeModel.bulkWrite(operations, { ordered: false });
        } catch (error) {
            console.log(error)
        }
    }
    private async fetchAniMapper (id : number) {
        try {
         const url = `${this.configService.get<string>('ANIMAPPER_API')}/stream/episodes?id=${id}&provider=ANIMEVIETSUB`;
        const res  = await axios.get(url);
        return res.data 
        } catch (error) {
            return null
        }

    }
    async getAnimeEpisodes(id: number) {
        const listEpsiode: EpisodeAnime[] = await this.episodeModel.find({ anilistId: id }).select(" -_id episodeNumber episodeId server")
        if (listEpsiode.length != 0) {
            return listEpsiode
        }
        const data : AnimeMapperResponse = await this.fetchAniMapper(id);
        // await this.saveToDB(id,data.episodes)
        if(!data)
            return []
       return data.episodes
    }
}