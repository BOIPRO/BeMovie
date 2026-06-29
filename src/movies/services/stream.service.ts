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
    async getTokenUser() {
        try {
            const res = await axios.get('https://animevietsub.pl', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
                    'Referer': 'https://animevietsub.pl/',
                    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Cookies': "https://animevietsub.pl"
                }
            });

            const data = res.data;
            const regex = /token:"([^"]+)"/;
            const match = data.match(regex);

            if (match && match[1]) {
                return match[1];
            } else {
                console.log("Không tìm thấy token trong trang web.");
            }
        } catch (error: any) {
            console.error("Lỗi khi fetch:", error.message);
        }
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
                const res: StreamLinkRes = await this.getURIEpisode(episodeId);
                const id = res.link.split('/').pop()!;
                this.saveStreamId(episode._id,episodeId,provider,id,server)
                console.log(id)

                return await this.getDecodeM3U8(id!)
            }
        }
        console.log("Ko vao trong server")
        // Xu li HDX
        return ''

    }
    async saveStreamId(id : any, episodeId :number, tenProvider : string, url : string,server : string) {
        const newServers = [{
            name: server,
            url: url,
        }

        ]
        await this.episodeModel.updateOne(
            { _id: id, "sources.provider": tenProvider }, // Điều kiện lọc
            [
                {
                    $set: {
                        sources: {
                            $map: {
                                input: "$sources",
                                as: "src",
                                in: {
                                    $cond: {
                                        if: { $eq: ["$$src.provider", tenProvider] },
                                        then: {
                                            $mergeObjects: [
                                                "$$src",
                                                {
                                                    episodeId: episodeId, // Hoặc giá trị bạn muốn update
                                                    servers: {
                                                        $concatArrays: [
                                                            {
                                                                $filter: {
                                                                    input: { $ifNull: ["$$src.servers", []] },
                                                                    as: "srv",
                                                                    cond: { $not: { $in: ["$$srv.name", ["DU", "EMBED"]] } }
                                                                }
                                                            },
                                                            newServers // Mảng mới cần thêm vào
                                                        ]
                                                    }
                                                }
                                            ]
                                        },
                                        else: "$$src"
                                    }
                                }
                            }
                        }
                    }
                }
            ],
            { updatePipeline: true }
        );
    }
    // generateSlug(episode) {
    //     const cleanEpisode = episode
    //         .toLowerCase()
    //         .trim()
    //         .replace(/\s+/g, '-')
    //         .replace(/\./g, '-')
    //         .replace(/[^a-z0-9-]/g, '');
    //     return `tap-${cleanEpisode}`;
    // };
    // async fixEpisodeSlug() {
    //     var bulkOps: any[] = [];
    //     var count = 0;
    //     const data = await this.episodeModel.find({ episodeSlug: { $exists: false } })
    //     data.forEach((doc) => {
    //         if (doc.episodeNumber) {
    //             // Sửa ep thành doc, lúc này this.generateSlug sẽ chạy chuẩn 100%
    //             const slugValue = this.generateSlug(doc.episodeNumber);

    //             // Đẩy lệnh update vào mảng gom hàng loạt
    //             bulkOps.push({
    //                 updateOne: {
    //                     filter: { _id: doc._id },
    //                     update: { $set: { episodeSlug: slugValue } }
    //                 }
    //             });

    //             count++;
    //         }
    //     });
    //     if (bulkOps.length > 0) {
    //         // Chạy mượt mà không còn lỗi "never" nữa
    //         await this.episodeModel.bulkWrite(bulkOps, { ordered: false });
    //         console.log(`Hoàn thành! Đã update ${count} bản ghi.`);
    //     }
    // }
    parseServers(responseData) {
        const $ = cheerio.load(responseData.html);
        const serverList: ExtractedServer[] = [];

        $('a.btn3dsv').each((index, element) => {
            const serverName = $(element).text().trim();

            const serverId = $(element).attr('data-id');
            const playType = $(element).attr('data-play');
            const encryptedHref = $(element).attr('data-href');
            serverList.push({
                name: serverName,
                id: serverId,
                type: playType,
                token: encryptedHref
            });
        });
        return serverList;
    }
    async getStreamLinkAVS(serverDu: ExtractedServer) {


        // const EPISODE_URL = 'https://animevietsub.name/phim/one-piece-dao-hai-tac-a1/xem-phim.html';
        const API_URL = 'https://animevietsub.pl/ajax/player';

        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest'
        };

        try {
            const payload = {
                link: serverDu.token,
                play: serverDu.type,
                id: serverDu.id,
                backuplinks: '1'
            };

            const ajaxHeaders = {
                ...baseHeaders,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                // 'Referer': EPISODE_URL,
            };
            const response = await axios.post(API_URL, payload, {
                headers: ajaxHeaders,
                transformRequest: [(data) => {
                    const dataObj = data as Record<string, any>;
                    return Object.entries(dataObj).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
                }]
            });
            return response.data;

        } catch (error: any) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            } else {
                console.error("Lỗi kết nối AJAX:", error.message);
            }
        }
    }
    async getURIEpisode(episodeId: number) {
        const API_URL = 'https://animevietsub.pl/ajax/player';
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest'
        };
        const payload = {
            episodeId: String(episodeId),
            backup: '1'
        };
        try {
            const response = await axios.post(API_URL, payload, {
                headers: baseHeaders,
                transformRequest: [(data) => {
                    const dataObj = data as Record<string, any>;
                    return Object.entries(dataObj).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
                }]
            });
            const serverList = this.parseServers(response.data);
            const serverDU = serverList.find(server => server.name.includes('DU'));
            if (!serverDU) {
                throw new NotFoundException("Không tìm thấy server DU trong danh sách.");
            }
            return await this.getStreamLinkAVS(serverDU);
        }
        catch (error: any) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            } else {
                console.log(error)
                console.error(" Lỗi kết nối AJAX:", error.message);
            }
        }
    }
    async getDecodeM3U8(idStream: string) {
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