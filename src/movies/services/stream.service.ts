import { HttpException, HttpStatus, Injectable, NotFoundException, } from "@nestjs/common";
import { RedisService } from "src/common/redis/redis.service";
import { Episode } from "../schema/episode.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import { Movie } from "../schema/movie.schema";
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
    async getAnimeEpisodes(id: number) : Promise<EpisodeAnime[]> {
        const listEpsiode: EpisodeAnime[] = await this.episodeModel.find({ anilistId: id }).select("episodeSlug episodeNumber server")
        return listEpsiode
    }
    async getStreamingLink(anilistId:number,episodeSlug :string) : Promise<string> {
        const filter = {
            $and : [
                {episodeSlug : episodeSlug},
                {anilistId : anilistId}
            ]
         }
          const [episode] = await this.episodeModel.find(filter).select("url").lean().exec();
         return episode?.url;
    }
    async changeURL () {
        await this.episodeModel.collection.updateMany(
  { url: { $exists: true } }, // Điều kiện: Tìm những document có field url
  [
    {
      $set: {
        url: { $last: { $split: [ "$url", "/" ] } }
      }
    }
  ]
)
    }

}