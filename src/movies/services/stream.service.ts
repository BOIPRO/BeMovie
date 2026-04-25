import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { META, ANIME } from '@consumet/extensions';
@Injectable()
export class StreamService {
    private anilist: InstanceType<typeof META.Anilist>;
    constructor() {
        this.anilist = new META.Anilist(new ANIME.AnimeSaturn());
    }
    async getStreamLinks(episodeId: string) {
        try {
            const data = await this.anilist.fetchEpisodeSources(episodeId);
            const sources = data.sources[0];
            const url = sources.url
            if (sources.isM3U8) {
                const playListM3u8 = await fetch(url).then(res => res.text());
                const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
                const linkM3u8 = (playListM3u8.match(/^\.\/.+\.m3u8$/gm) || [])
                    .map(line => baseUrl + line.replace("./", ""));
                return linkM3u8;
            }
            return [
                url
            ]
        } catch (error) {
            console.log(error)
        }
    }

    async getAnimeEpisodes(id: string) {
        try {
            return (await this.anilist.fetchAnimeInfo(id));
        } catch (error) {
            throw new HttpException(
                'Server phim đang bảo trì, vui lòng thử lại sau!',
                HttpStatus.SERVICE_UNAVAILABLE,
            );

        }

    }
}