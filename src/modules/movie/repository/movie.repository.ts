import { Injectable, NotFoundException } from "@nestjs/common";
import { Anime } from "../schema/anime.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Episode } from "../schema/episode.schema";
import { EpisodeAnimeType } from "../interface/streamType";
@Injectable()
export class MovieRepository {

    constructor(
        // private readonly redisService: RedisService,
        @InjectModel(Anime.name)
        private animeModel: Model<Anime>,
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
    ) { }
    private queryListAnime = async (conditionalMatch: Record<string, any>, conditionalSort: Record<string, any>, limit: number, skip: number) => {
        const data = await this.animeModel.aggregate([
            {
                $match: conditionalMatch
            },
            { $sort: conditionalSort },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    anilistId: 1,
                    "anilistData.coverImage.large": 1,
                    slug: 1,
                    currentEpisode: 1,
                    title: {
                        $let: {
                            vars: {
                                target: {
                                    $filter: {
                                        input: "$mappings",
                                        as: "m",
                                        cond: { $eq: ["$$m.provider", "animevietsub"] }
                                    }
                                }
                            },
                            in: { $arrayElemAt: ["$$target.title", 0] }
                        }
                    }
                }
            }
        ]);

        return data;
    }
    async getListBanner() {
        const bannerAnime = await this.animeModel.aggregate([
            {
                $match: {
                    status: "MAPPED",
                    "anilistData.bannerImage": { $ne: null },
                    "anilistData.seasonYear": 2026
                }
            },
            { $unwind: "$mappings" },
            { $match: { "mappings.provider": "animevietsub" } },

            { $sample: { size: 10 } },
            {
                $lookup: {
                    from: "episodes",
                    let: { anilistId: "$anilistId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$anilistId", "$$anilistId"] }
                            }
                        },
                        { $sort: { episodeNumber: 1 } },
                        { $limit: 1 }
                    ],
                    as: "firstEpisode"
                }
            },
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    anilistId: 1,
                    title: "$mappings.title",
                    "anilistData.bannerImage": 1,
                    "anilistData.trailer": 1,
                    "anilistData.averageScore" : 1,
                    "anilistData.coverImage.large": 1,
                    "anilistData.seasonYear": 1,
                    firstEpisode: { $arrayElemAt: ["$firstEpisode.episodeSlug", 0] }
                }
            }
        ]);
        return bannerAnime
    }
    async getListTrending(limit: number) {
        const match = {
            status: "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null }
        }
        const sort = { "anilistData.trending": -1 };
        const listTrendingAnimes = await this.queryListAnime(match, sort, limit, 0)
        return listTrendingAnimes
    }
    async getListPopularity(limit: number) {
        const match = {
            status: "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null }
        }
        const sort = { "anilistData.popularity": -1 };
        const listTrendingAnimes = await this.queryListAnime(match, sort, limit, 0)
        return listTrendingAnimes
    }
    async getListAnimeOfTheYear(limit: number) {
        const nowYear = new Date().getFullYear()
        const match = {
            status: "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null },
            "anilistData.seasonYear": nowYear
        }
        const sort = { "anilistData.trending": -1 }
        const listAnimesOfYear = this.queryListAnime(match, sort, limit, 0)
        return listAnimesOfYear
    }
    async getListAnimeReleasing(limit: number) {
        const match = {
            status: "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: "Completed" },
        }
        const sort = { "updatedAt": -1 }
        const listAnimeReleasing = this.queryListAnime(match, sort, limit, 0)
        return listAnimeReleasing

    }
    async findOne(id: number): Promise<Partial<Anime>[]> {
        const data = await this.animeModel.aggregate([
            // 1. Tìm đúng document cần thiết
            { $match: { anilistId: id } },

            // 2. Chuyển đổi dữ liệu để lọc title
            {
                $project: {
                    anilistId: 1,
                    "anilistData.genres": 1,
                    "anilistData.coverImage.large": 1,
                    "anilistData.seasonYear": 1,
                    "anilistData.title.romaji": 1,
                    "anilistData.title.english": 1,
                    "anilistData.averageScore": 1,
                    "mappings.description": 1,
                    slug: 1,
                    // Lọc title của animevietsub từ mảng mappings
                    animevietInfo: {
                        $let: {
                            vars: {
                                target: {
                                    $filter: {
                                        input: "$mappings",
                                        as: "m",
                                        cond: { $eq: ["$$m.provider", "animevietsub"] }
                                    }
                                }
                            },
                            in: { $arrayElemAt: ["$$target", 0] }
                        }
                    }
                }
            },
            {
                $project: {
                    anilistId: 1,
                    "anilistData": 1,
                    slug: 1,
                    title: "$animevietInfo.title",
                    description: "$animevietInfo.description"
                }
            }
        ]);
        if (!data) {
            throw new NotFoundException("Cant find anime");
        }
        return data[0]
    }
    async getYearPage(page: number = 1, limit: number = 30): Promise<{
        media: any[];
        totalPages: number;
    }> {
        const currentYear = new Date().getFullYear();
        const skip = (page - 1) * limit
        const match = {
            "status": "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null },
            "anilistData.seasonYear": currentYear
        };
        const sort = { "anilistData.popularity": -1 }
        const [data, totalDocuments] = await Promise.all([
            this.queryListAnime(match, sort, limit, skip),
            this.animeModel.countDocuments(match)
        ])
        const effectiveTotal = Math.max(0, totalDocuments);
        const totalPages = Math.ceil(effectiveTotal / limit);
        return {
            media: data,
            totalPages: totalPages
        }
    }
    async getPopularityPage(page: number = 1, limit: number = 30): Promise<{
        media: any[];
        totalPages: number;
    }> {
        const skip = (page - 1) * limit
        const match = {
            "status": "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null }
        };
        const sort = { "anilistData.popularity": -1 }
        const [data, totalDocuments] = await Promise.all([
            this.queryListAnime(match, sort, limit, skip),
            this.animeModel.countDocuments(match)
        ])
        const effectiveTotal = Math.max(0, totalDocuments);
        const totalPages = Math.ceil(effectiveTotal / limit);
        return {
            media: data,
            totalPages: totalPages
        }
    }
    async suggest(search?: string) {
        const result = await this.animeModel.aggregate([
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            { autocomplete: { query: search, path: "anilistData.title.romaji" } },
                            { autocomplete: { query: search, path: "anilistData.title.english" } },
                            { autocomplete: { query: search, path: "mappings.title" } }
                        ],
                        filter: [
                            {
                                text: {
                                    path: "status",
                                    query: "MAPPED"
                                }
                            }
                        ],
                        minimumShouldMatch: 1
                    }
                }
            },
            { $limit: 7 },
            { $sort: { "anilistData.popularity": -1 } },
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    anilistId: 1,
                    "anilistData.coverImage.large": 1,
                    "anilistData.seasonYear": 1,
                    title: {
                        $let: {
                            vars: {
                                target: {
                                    $filter: {
                                        input: "$mappings",
                                        as: "m",
                                        cond: { $eq: ["$$m.provider", "animevietsub"] }
                                    }
                                }
                            },
                            in: { $arrayElemAt: ["$$target.title", 0] }
                        }
                    }
                }
            }
        ])
        return result
    }
    async searchAnime(search?: string, page: number = 1, limit: number = 30): Promise<{
        media: any[];
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;
        const result = await this.animeModel.aggregate([
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            { autocomplete: { query: search, path: "anilistData.title.romaji" } },
                            { autocomplete: { query: search, path: "anilistData.title.english" } },
                            { autocomplete: { query: search, path: "mappings.title" } }
                        ],
                        filter: [{ text: { path: "status", query: "MAPPED" } }],
                        minimumShouldMatch: 1
                    }
                }
            },
            {
                $facet: {
                    // Nhánh 1: Lấy dữ liệu phân trang
                    data: [
                        { $sort: { "anilistData.popularity": -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                slug: 1,
                                currentEpisode: 1,
                                anilistId: 1,
                                "anilistData.coverImage.large": 1,
                                "anilistData.seasonYear": 1,
                                title: {
                                    $let: {
                                        vars: {
                                            target: {
                                                $filter: {
                                                    input: "$mappings",
                                                    as: "m",
                                                    cond: { $eq: ["$$m.provider", "animevietsub"] }
                                                }
                                            }
                                        },
                                        in: { $arrayElemAt: ["$$target.title", 0] }
                                    }
                                }
                            }
                        }
                    ],
                    // Nhánh 2: Lấy tổng số lượng kết quả
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]);
        const totalDocuments = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocuments / limit);
        return {
            media: result[0].data,
            totalPages: totalPages
        }
    }
    async getAllAnimes() {
        
        const data = await this.animeModel.find({
             "status": "MAPPED",
            "mappings.provider": "animevietsub",
            "mappings.providerStatus": { $ne: null }
        }).select("anilistId slug -_id").lean().exec()
        return data
    }
    async getListEpisodes(id: number): Promise<EpisodeAnimeType[]> {
        const listEpsiode: EpisodeAnimeType[] = await this.episodeModel.find({ anilistId: id }).select("episodeSlug episodeNumber")

        return listEpsiode
    }
    async getOneEpisode(anilistId: number, episodeSlug: string,provider: string) {
         const filter = {
            episodeSlug: episodeSlug,
            anilistId: anilistId,
            "sources.provider": provider
        };
        const episode = await this.episodeModel
            .findOne(filter)
            .select("sources ")
            .lean()
            .exec()
        return episode
    }
      async getBannerImage() {
        const URL = 'https://graphql.anilist.co';
        const CHUNK_SIZE = 50;
        const finalResults = {};
        const chunkArray = (arr, size) =>
          Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
          );
        const query = `
    query ($ids: [Int]) {
      Page(page: 1, perPage: 50) {
        media(id_in: $ids) {
          id
          averageScore
        }
      }
    }
    `;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const data = await this.animeModel.find({ 
            status: "MAPPED",
            "anilistData.averageScore" : { $exists: false }
         }).distinct("anilistId");
        console.log(data.length)
        const chunks = Array.from({ length: Math.ceil(data.length / CHUNK_SIZE) }, (v, i) =>
          data.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
        );
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          try {
            // 1. Fetch dữ liệu từ AniList
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

            if (mediaList.length === 0) continue;

            // 2. Tạo mảng các thao tác (Operations) cho bulkWrite
            const bulkOps = mediaList.map(anime => ({
              updateOne: {
                filter: { anilistId: anime.id }, // Tìm theo AniList ID
                update: {
                  $set: {
                    "anilistData.averageScore": anime.averageScore,
                  }
                },
                upsert: false
              }
            }));
            // 3. Thực thi bulkWrite ghi thẳng vào DB
            const bulkResult = await this.animeModel.bulkWrite(bulkOps);

            console.log(`✅ [Nhóm ${i + 1}/${chunks.length}] Ghi DB thành công: Upserted: ${bulkResult.upsertedCount}, Modified: ${bulkResult.modifiedCount}`);

            // Tránh spam API AniList quá nhanh
            await sleep(1500);

          } catch (error) {
            console.error(`❌ Lỗi tại nhóm thứ ${i + 1}:`, error);
          }
        }


      }

}