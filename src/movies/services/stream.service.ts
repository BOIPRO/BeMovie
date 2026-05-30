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
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
        @InjectModel(Movie.name)
        private movieModel: Model<Movie>,
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
    async fixAnimeURL () {
      const data = await this.movieModel.find({isPublished : true}).select("anilistId");
      for (const anime of data) {
        const anilistId = anime.anilistId;
        const filter = { anilistId: anilistId };
        const episodes = await this.episodeModel.find(filter).select("url");
        if (episodes.length == 0) {
            await this.movieModel.updateOne(
                { anilistId: anilistId }, 
                { isPublished: false }),
                {$unset : {
                    iscomplete : "",
                }}
        }
      }
    }

}