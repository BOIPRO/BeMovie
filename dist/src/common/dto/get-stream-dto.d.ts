declare enum ProviderEnum {
    ANIMEVIETSUB = "animevietsub"
}
declare enum ServerEnum {
    HDX = "EMBED",
    DU = "DU"
}
export declare class GetStreamQueryDto {
    anilistId: number;
    episodeSlug: string;
    provider: ProviderEnum;
    server: ServerEnum;
}
export {};
