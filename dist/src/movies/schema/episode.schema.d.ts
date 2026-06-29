import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type EpisodeDocument = HydratedDocument<Episode>;
export declare class Server {
    name: string;
    url: string;
}
export declare const ServerSchema: MongooseSchema<Server, import("mongoose").Model<Server, any, any, any, any, any, Server>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Server, import("mongoose").Document<unknown, {}, Server, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Server & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Server, import("mongoose").Document<unknown, {}, Server, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Server & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, Server, import("mongoose").Document<unknown, {}, Server, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Server & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Server>;
export declare class Source {
    provider: string;
    episodeId: number;
    servers: Server[];
}
export declare const SourceSchema: MongooseSchema<Source, import("mongoose").Model<Source, any, any, any, any, any, Source>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Source, import("mongoose").Document<unknown, {}, Source, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Source & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    provider?: import("mongoose").SchemaDefinitionProperty<string, Source, import("mongoose").Document<unknown, {}, Source, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Source & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    episodeId?: import("mongoose").SchemaDefinitionProperty<number, Source, import("mongoose").Document<unknown, {}, Source, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Source & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    servers?: import("mongoose").SchemaDefinitionProperty<Server[], Source, import("mongoose").Document<unknown, {}, Source, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Source & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Source>;
export declare class Episode {
    anilistId: number;
    episodeNumber: string;
    sources: Source[];
    episodeSlug: string;
}
export declare const EpisodeSchema: MongooseSchema<Episode, import("mongoose").Model<Episode, any, any, any, any, any, Episode>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Episode, import("mongoose").Document<unknown, {}, Episode, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Episode & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    anilistId?: import("mongoose").SchemaDefinitionProperty<number, Episode, import("mongoose").Document<unknown, {}, Episode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Episode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    episodeNumber?: import("mongoose").SchemaDefinitionProperty<string, Episode, import("mongoose").Document<unknown, {}, Episode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Episode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sources?: import("mongoose").SchemaDefinitionProperty<Source[], Episode, import("mongoose").Document<unknown, {}, Episode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Episode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    episodeSlug?: import("mongoose").SchemaDefinitionProperty<string, Episode, import("mongoose").Document<unknown, {}, Episode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Episode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Episode>;
