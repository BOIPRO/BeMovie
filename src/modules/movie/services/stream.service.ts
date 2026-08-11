import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { DecryptService } from "./decryptm3u8.service";
import { RedisService } from "src/common/redis/redis.service";
import { MovieRepository } from "../repository/movie.repository";
import { EpisodeAnimeType } from "../interface/streamType";
import { SupabaseService } from "src/common/supabase/supabase.service";
@Injectable()
export class StreamService {
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly redisService: RedisService,
        private readonly decryptService: DecryptService,
        private readonly supabaseService: SupabaseService
    ) {

    }
    private  getM3U8URLFromSupabase(filename: string): string {
        const publicUrl =  this.supabaseService.getPublicUrl(filename);
        if (!publicUrl) {
            throw new Error('Không thể lấy public URL từ Supabase');
        }
        return publicUrl;
    }
    private async uploadM3U8ToSupabase(filename: string, rawData: string): Promise<void> {
        try {
            await this.supabaseService.uploadM3u8(filename, rawData);
        } catch (error) {
            console.error('Lỗi khi tải lên M3U8 lên Supabase:', error);
            throw new Error('Không thể tải lên M3U8 lên Supabase');
        }
    }
    async getAnimeEpisodes(id: number): Promise<EpisodeAnimeType[]> {
        return await this.movieRepository.getListEpisodes(id)
    }
    async getStreamingLink(anilistId: number, episodeSlug: string, provider: string, server: string): Promise<any> {
        const episode = await this.movieRepository.getOneEpisode(anilistId, episodeSlug, provider)
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
                else {
                    const dataM3U8 = await this.getDecodeM3U8(url)
                    this.redisService.set(String(targetProvider.episodeId), dataM3U8, 2)
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
        const checkFileExists = await this.supabaseService.checkFileExists(`${idStream}.m3u8`);
        if (checkFileExists) {
            const m3u8FromSupabase = this.getM3U8URLFromSupabase(`${idStream}.m3u8`);
            return m3u8FromSupabase
        }
        const API_URL = `https://stream.googleapiscdn.com/playlist/${idStream}/playlist.m3u8`
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
            await this.uploadM3U8ToSupabase(`${idStream}.m3u8`, rawData);
            const publicUrl = this.getM3U8URLFromSupabase(`${idStream}.m3u8`);
            // const sizeInBytes = Buffer.byteLength(rawData, 'utf8');
            // console.log(`Dung lượng rawData: ${sizeInBytes} bytes`);

            // const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            // console.log(`Dung lượng rawData: ${sizeInKB} KB`);
            console.log(`Đã tải lên M3U8 lên Supabase và lấy public URL: ${publicUrl}`);
            return publicUrl
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