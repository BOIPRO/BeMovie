import { HttpException, HttpStatus, Injectable, NotFoundException, } from "@nestjs/common";
import { RedisService } from "src/common/redis/redis.service";
import { Episode } from "../schema/episode.schema";
import { InjectModel, raw } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Movie } from "../schema/movie.schema";
import { DecryptService } from "./decryptm3u8.service";
export interface EpisodeAnime {
    anilistID: number,
    episodeNumber: string,
    episodeId: string,
    server: string,
    episodeSlug: string,
}
export interface ExtractedServer {
    name: string;
    id: string | undefined;
    type: string | undefined;
    token: string | undefined;
}
export interface StreamLinkRes {
    success: number,
    _fxStatus: number,
    title: string,
    link: string,
    playTech: string
}
@Injectable()
export class StreamService {
    constructor(
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
        // @InjectModel(Movie.name)
        // private movieModel: Model<Movie>,
        private readonly decryptService: DecryptService
    ) {

    }
    async getAnimeEpisodes(id: number): Promise<EpisodeAnime[]> {
        const listEpsiode: EpisodeAnime[] = await this.episodeModel.find({ anilistId: id }).select("episodeSlug episodeNumber")
        return listEpsiode
    }
    async getStreamingLink(anilistId: number, episodeSlug: string, provider: string, server: string): Promise<any> {
        const filter = {
            episodeSlug: episodeSlug,
            anilistId: anilistId,
            "sources.provider": provider
        };
        const episode = await this.episodeModel
            .findOne(filter)
            .select("sources")
            .lean()
            .exec();
        if (!episode) {
            return ""
        }
        const targetProvider = episode.sources.find(s => s.provider === provider);
        const targetServer = targetProvider?.servers.find(s => s.name == server)
        if (server == "DU") {
            const url = targetServer?.url
            if (url) {
                console.log(url)
                return await this.getDecodeM3U8(url)
            }
            else {
                const episodeId = targetProvider?.episodeId
                console.log(episodeId)
                if (!episodeId) {
                    return ""
                }
                // const id = res.link.split('/').pop()!;
                // this.saveStreamId(episode._id,episodeId,provider,id,server)
                // console.log(id)
                return ''
                // return await this.getDecodeM3U8(id!)
            }
        }
        console.log("Ko vao trong server")
        // Xu li HDX
        return ''

    }
    private async getDecodeM3U8(idStream: string) {
        const API_URL = `https://storage.googleapiscdn.com/playlist/${idStream}/playlist.m3u8`
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest',
            'referer': `https://storage.googleapiscdn.com/playlist/${idStream}`
        };
        try {
            const response = await axios.get(API_URL, {
                headers: baseHeaders
            });
            const rawData = await this.decryptService._0x1cf828(String(response.data), response.headers)
            // const envelope = response.headers['x-envelope'];
            // console.log(envelope)
            // const rawdata = await this.decryptM3u8(response)
            // console.log(rawdata)
            return rawData
        }
        catch (error: any) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            } else {
                console.error(" Lỗi kết nối AJAX:", error.message);
            }
        }

    }

}