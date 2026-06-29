import { Document, InferSchemaType } from 'mongoose';
declare class NextAiringEpisode {
    episode: number;
}
export declare class Movie extends Document {
    anilistId: number;
    idMal: number;
    titleRomaji: string;
    slug: string;
    titleEnglish: string;
    coverImage: string;
    genres: string[];
    averageScore: number;
    popularity: number;
    trending: number;
    description: string;
    status: string;
    anilistUpdatedAt: number;
    isAdult: boolean;
    isPublished: boolean;
    lastChecked: Date;
    checkAttempts: number;
    episodes: number;
    isComplete: boolean;
    nextAiringEpisode: NextAiringEpisode;
}
export declare const MovieSchema: import("mongoose").Schema<Movie, import("mongoose").Model<Movie, any, any, any, any, any, Movie>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Movie, Document<unknown, {}, Movie, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    slug?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    anilistId?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    coverImage?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    episodes?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    genres?: import("mongoose").SchemaDefinitionProperty<string[], Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trending?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    popularity?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageScore?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    titleRomaji?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    titleEnglish?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    idMal?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    anilistUpdatedAt?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isAdult?: import("mongoose").SchemaDefinitionProperty<boolean, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastChecked?: import("mongoose").SchemaDefinitionProperty<Date, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    checkAttempts?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isComplete?: import("mongoose").SchemaDefinitionProperty<boolean, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextAiringEpisode?: import("mongoose").SchemaDefinitionProperty<NextAiringEpisode, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Movie>;
export type Movies = InferSchemaType<typeof MovieSchema>;
export {};
