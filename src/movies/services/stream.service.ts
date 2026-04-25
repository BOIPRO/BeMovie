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
            const urlPlayListM3u8 = data.sources[0].url;
            const playListM3u8 = await fetch(urlPlayListM3u8).then(res => res.text());
            const baseUrl = urlPlayListM3u8.substring(0, urlPlayListM3u8.lastIndexOf("/") + 1);
            const linkM3u8 = (playListM3u8.match(/^\.\/.+\.m3u8$/gm) || [])
                .map(line => baseUrl + line.replace("./", ""));
            return linkM3u8;
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