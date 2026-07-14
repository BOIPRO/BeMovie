export interface EpisodeAnimeType {
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