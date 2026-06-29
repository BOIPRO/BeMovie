"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../common/redis/redis.service");
const mongoose_1 = require("mongoose");
const anime_schema_1 = require("../schema/anime.schema");
const mongoose_2 = require("@nestjs/mongoose");
let MoviesService = class MoviesService {
    redisService;
    animeModel;
    constructor(redisService, animeModel) {
        this.redisService = redisService;
        this.animeModel = animeModel;
    }
    AnimeStrategies = {
        banner: async (limit) => {
            const bannerAnime = await this.animeModel.aggregate([
                {
                    $match: {
                        status: "MAPPED",
                        "anilistData.averageScore": { $gte: 75 },
                        "anilistData.bannerImage": { $ne: null },
                        "anilistData.seasonYear": 2026
                    }
                },
                { $unwind: "$mappings" },
                {
                    $match: {
                        "mappings.provider": "animevietsub"
                    }
                },
                { $sample: { size: 10 } },
                {
                    $project: {
                        _id: 1,
                        anilistId: 1,
                        "anilistData.averageScore": 1,
                        "anilistData.bannerImage": 1,
                        "anilistData.seasonYear": 1,
                        "anilistData.trailer": 1,
                        "anilistData.coverImage.large": 1,
                        title: "$mappings.title"
                    }
                }
            ]);
            return bannerAnime;
        },
        trending: async (limit) => {
            const dataTrending = null;
            if (dataTrending) {
                return dataTrending;
            }
            else {
                const expiretime = 300;
                const data = await this.animeModel.find({
                    status: "MAPPED",
                    "mappings.provider": "animevietsub",
                    "mappings.providerStatus": { $ne: null }
                }).sort({ "anilistData.trending": -1 })
                    .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season mappings.title slug mappings.description anilistData.trending').limit(limit).lean().exec();
                return data;
            }
        },
        popularity: async (limit) => {
            const data = await this.animeModel.find({
                status: "MAPPED",
                "mappings.provider": "animevietsub",
                "mappings.providerStatus": { $ne: null }
            }).sort({ "anilistData.popularity": -1 })
                .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug mappings.description mappings.title ').limit(limit).lean().exec();
            return data;
        },
        animeOfTheYear: async (limit) => {
            const nowYear = new Date().getFullYear();
            const data = await this.animeModel.find({
                status: "MAPPED",
                "mappings.provider": "animevietsub",
                "mappings.providerStatus": { $ne: null },
                "anilistData.seasonYear": nowYear
            }).sort({ "anilistData.trending": -1 })
                .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug  mappings.description mappings.title').limit(limit).lean().exec();
            return data;
        }
    };
    async getAnimeData(limit, type) {
        const executionFn = this.AnimeStrategies[type];
        if (!executionFn)
            return [];
        return executionFn(limit);
    }
    async getMultipleAnimeLists(limit, types) {
        const results = await Promise.all(types.map(type => this.getAnimeData(limit, type)));
        return types.reduce((acc, type, index) => {
            acc[type] = results[index];
            return acc;
        }, {});
    }
    async findOneAnime(id) {
        const data = await this.animeModel.find({ anilistId: id }).select('anilistId anilistData.genres anilistData.coverImage.large anilistData.bannerImage anilistData.seasonYear anilistData.season  slug anilistData.title mappings.description mappings.title anilistData.trending coverImage.large anilistData.averageScore');
        if (!data) {
            throw new common_1.NotFoundException("Cant find anime");
        }
        return data;
    }
    async getPageAnimes(key, page, limit) {
        const data = null;
        if (data) {
            return data;
        }
        else {
            const expiretime = 300;
            const data = await this.getPage(page, limit);
            return data;
        }
    }
    async getPage(page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const filter = {
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null }
        };
        const [data, totalDocuments] = await Promise.all([
            this.animeModel
                .find(filter)
                .sort({ "anilistData.popularity": -1 })
                .skip(skip)
                .limit(limit)
                .select('anilistId anilistData.genres anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug anilistData.title.romaji mappings.description mappings.title anilistData.trending anilistData.title.english coverImage.large')
                .lean()
                .exec(),
            this.animeModel.countDocuments(filter)
        ]);
        const effectiveTotal = Math.max(0, totalDocuments);
        const totalPages = Math.ceil(effectiveTotal / limit);
        return {
            media: data,
            totalPages: totalPages
        };
    }
    async searchAnime(search, page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const result = await this.animeModel.aggregate([
            {
                $search: {
                    index: "searchAnime",
                    compound: {
                        must: [
                            {
                                autocomplete: {
                                    query: search,
                                    path: "titleRomaji",
                                    fuzzy: {
                                        maxEdits: 1
                                    }
                                }
                            },
                            {
                                autocomplete: {
                                    query: search,
                                    path: "titleEnglish",
                                    fuzzy: {
                                        maxEdits: 1
                                    }
                                }
                            }
                        ],
                        filter: [
                            {
                                equals: {
                                    path: "isPublished",
                                    value: true
                                }
                            }
                        ]
                    }
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    meta: [
                        {
                            $count: "total"
                        }
                    ]
                }
            }
        ]);
        const data = result[0]?.data || [];
        const totalDocuments = result[0]?.meta[0]?.total || 0;
        const totalPages = Math.ceil(totalDocuments / limit);
        return {
            media: data,
            totalPages: totalPages
        };
    }
    async getTrailer() {
        const URL = 'https://graphql.anilist.co';
        const CHUNK_SIZE = 50;
        const finalResults = {};
        const chunkArray = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
        const query = `
query ($ids: [Int]) {
  Page(page: 1, perPage: 50) {
    media(id_in: $ids) {
      id
      trailer {
      id
      site
      thumbnail
    }
    }
  }
}
`;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const data = await this.animeModel.find({ status: "MAPPED" }).distinct("anilistId");
        const chunks = Array.from({ length: Math.ceil(data.length / CHUNK_SIZE) }, (v, i) => data.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            try {
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { ids: chunk } })
                });
                if (!response.ok) {
                    console.error(`❌ Lỗi API AniList tại nhóm ${i + 1}`);
                    continue;
                }
                const resData = await response.json();
                const mediaList = resData.data.Page.media;
                if (mediaList.length === 0)
                    continue;
                const bulkOps = mediaList.map(anime => ({
                    updateOne: {
                        filter: { anilistId: anime.id },
                        update: {
                            $set: {
                                "anilistData.trailer": anime.trailer,
                            }
                        },
                        upsert: false
                    }
                }));
                const bulkResult = await this.animeModel.bulkWrite(bulkOps);
                console.log(`✅ [Nhóm ${i + 1}/${chunks.length}] Ghi DB thành công: Upserted: ${bulkResult.upsertedCount}, Modified: ${bulkResult.modifiedCount}`);
                await sleep(1500);
            }
            catch (error) {
                console.error(`❌ Lỗi tại nhóm thứ ${i + 1}:`, error);
            }
        }
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(anime_schema_1.Anime.name)),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        mongoose_1.Model])
], MoviesService);
//# sourceMappingURL=movies.service.js.map