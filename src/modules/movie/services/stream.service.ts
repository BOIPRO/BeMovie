import {  Injectable } from "@nestjs/common";
import axios from 'axios';
import { DecryptService } from "./decryptm3u8.service";
import { RedisService } from "src/common/redis/redis.service";
import { MovieRepository } from "../repository/movie.repository";
import { EpisodeAnimeType } from "../interface/streamType";
@Injectable()
export class StreamService {
    constructor(
         private readonly movieRepository : MovieRepository,
        private readonly redisService : RedisService,
        private readonly decryptService: DecryptService
    ) {

    }
    async getAnimeEpisodes(id: number): Promise<EpisodeAnimeType[]> {
      return await this.movieRepository.getListEpisodes(id)
    }
    async getStreamingLink(anilistId: number, episodeSlug: string, provider: string, server: string): Promise<any> {
        const episode = await this.movieRepository.getOneEpisode(anilistId,episodeSlug,provider)
        if (!episode) {
            return ""
        }
        const targetProvider = episode.sources.find(s => s.provider === provider);
        const targetServer = targetProvider?.servers.find(s => s.name == server)
        if (server == "DU") {
            const url = targetServer?.url
            if (url) {
                const rawM3U8 = await this.redisService.get(String(targetProvider.episodeId))
                if (rawM3U8) {
                    return rawM3U8
                }
                else  {
                     const dataM3U8 =  await this.getDecodeM3U8(url)
                    this.redisService.set(String(targetProvider.episodeId),dataM3U8,2)
                     return dataM3U8
                }
            }
            return ""
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