import { Episode } from "../schema/episode.schema";
import { Model } from "mongoose";
import { DecryptService } from "./decryptm3u8.service";
export interface EpisodeAnime {
    anilistID: number;
    episodeNumber: string;
    episodeId: string;
    server: string;
    episodeSlug: string;
}
export interface ExtractedServer {
    name: string;
    id: string | undefined;
    type: string | undefined;
    token: string | undefined;
}
export interface StreamLinkRes {
    success: number;
    _fxStatus: number;
    title: string;
    link: string;
    playTech: string;
}
export declare class StreamService {
    private episodeModel;
    private readonly decryptService;
    constructor(episodeModel: Model<Episode>, decryptService: DecryptService);
    getAnimeEpisodes(id: number): Promise<EpisodeAnime[]>;
    getTokenUser(): Promise<any>;
    getStreamingLink(anilistId: number, episodeSlug: string, provider: string, server: string): Promise<any>;
    saveStreamId(id: any, episodeId: number, tenProvider: string, url: string, server: string): Promise<void>;
    parseServers(responseData: any): ExtractedServer[];
    getStreamLinkAVS(serverDu: ExtractedServer): Promise<any>;
    getURIEpisode(episodeId: number): Promise<any>;
    getDecodeM3U8(idStream: string): Promise<string | undefined>;
}
