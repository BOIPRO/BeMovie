import { HydratedDocument } from 'mongoose';
export type AnimeDocument = HydratedDocument<Anime>;
declare class TitleDetail {
    romaji: string;
    english: string;
    native: string;
}
declare class CoverImageDetail {
    large: string;
}
export declare class TrailerDetail {
    id: string;
    site: string;
    thumbnail: string;
}
export declare class AnilistDataDetail {
    title: TitleDetail;
    coverImage: CoverImageDetail;
    episodes: number;
    seasonYear: number;
    season: string;
    status: string;
    genres: string[];
    description: string;
    trending: number;
    popularity: number;
    averageScore: number;
    bannerImage: string;
    trailer: TrailerDetail | null;
}
export declare class ProviderMapping {
    provider: string;
    meidaId: string;
    title: string;
    sourceUrl: string;
    subTitle: string;
    description: string;
    providerStatus: string;
    year: string;
}
export declare class Anime {
    slug: string;
    title: string;
    status: string;
    anilistId: number;
    anilistData: AnilistDataDetail;
    mappings: ProviderMapping[];
}
export declare const AnimeSchema: import("mongoose").Schema<Anime, import("mongoose").Model<Anime, any, any, any, any, any, Anime>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Anime, import("mongoose").Document<unknown, {}, Anime, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    slug?: import("mongoose").SchemaDefinitionProperty<string, Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    anilistId?: import("mongoose").SchemaDefinitionProperty<number, Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    anilistData?: import("mongoose").SchemaDefinitionProperty<AnilistDataDetail, Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mappings?: import("mongoose").SchemaDefinitionProperty<ProviderMapping[], Anime, import("mongoose").Document<unknown, {}, Anime, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Anime & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Anime>;
export {};
