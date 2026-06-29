import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { Model } from 'mongoose';
import { Anime } from "../schema/anime.schema";
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class MoviesService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Anime.name)
    private animeModel: Model<Anime>
  ) { }
  private AnimeStrategies: Record<string, (limit: number) => Promise<Partial<Anime>[]>> = {
    banner: async (limit: number) => {
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
            title: "$mappings.title" // Gọi trực tiếp như thế này là xong!

          }
        }
      ]);
      return bannerAnime
    },
    trending: async (limit: number) => {
      const dataTrending = null
      if (dataTrending) {
        return dataTrending;
      }
      // anilistId anilistData.genres anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug anilistData.title.romaji mappings.description mappings.title anilistData.trending   anilistData.title.english coverImage.large
      else {
        const expiretime = 300
        const data = await this.animeModel.find({
          status: "MAPPED",
          "mappings.provider": "animevietsub",
          "mappings.providerStatus": { $ne: null }
        }).sort({ "anilistData.trending": -1 })

          .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season mappings.title slug mappings.description anilistData.trending').limit(limit).lean().exec()
        // await this.redisService.set(key, JSON.stringify(data), expiretime)
        return data
      }
    },
    popularity : async(limit : number) => {
       const data = await this.animeModel.find({
      status: "MAPPED",
      "mappings.provider": "animevietsub",
      "mappings.providerStatus": { $ne: null }
    }).sort({ "anilistData.popularity": -1 })
      .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug mappings.description mappings.title ').limit(limit).lean().exec()
    // await this.redisService.set(key, JSON.stringify(data), expiretime)
    return data
    },
    animeOfTheYear : async(limit : number) => {
      const nowYear = new Date().getFullYear()
    const data = await this.animeModel.find({
      status: "MAPPED",
      "mappings.provider": "animevietsub",
      "mappings.providerStatus": { $ne: null },
      "anilistData.seasonYear": nowYear
    }).sort({ "anilistData.trending": -1 })

      .select(' anilistId anilistData.coverImage.large anilistData.seasonYear anilistData.season  slug  mappings.description mappings.title').limit(limit).lean().exec()
    return data
    }
  }
  async getAnimeData(limit :number,type : string) {
    const executionFn = this.AnimeStrategies[type]
    if (!executionFn) return [];
    return executionFn(limit)
  }
  async getMultipleAnimeLists(limit :number,types : string[]) {
    const results = await Promise.all(
      types.map(type => this.getAnimeData(limit, type))
    );
    return types.reduce((acc, type, index) => {
      acc[type] = results[index];
      return acc;
    }, {} as Record<string, any>);
  }
  async findOneAnime(id: number): Promise<Partial<Anime>[]> {
    const data = await this.animeModel.find({ anilistId: id }).select('anilistId anilistData.genres anilistData.coverImage.large anilistData.bannerImage anilistData.seasonYear anilistData.season  slug anilistData.title mappings.description mappings.title anilistData.trending coverImage.large anilistData.averageScore')
    if (!data) {
      throw new NotFoundException("Cant find anime");
    }
    return data
  }
  async getPageAnimes(key: string, page: number, limit: number): Promise<{
    media: any[];
    totalPages: number;
  }> {
    // const data = await this.redisService.get(key);
    const data = null
    if (data) {
      return data;
    }
    else {
      const expiretime = 300
      const data = await this.getPage(page, limit);
      // await this.redisService.set(key, JSON.stringify(data), expiretime)
      return data
    }
  }

  async getPage(page: number = 1, limit: number = 30): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit
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
    ])
    const effectiveTotal = Math.max(0, totalDocuments);
    const totalPages = Math.ceil(effectiveTotal / limit);
    return {
      media: data,
      totalPages: totalPages
    }
  }

  async searchAnime(search?: string, page: number = 1, limit: number = 30): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const result = await
      this.animeModel.aggregate([
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
      ])
    const data = result[0]?.data || [];
    const totalDocuments = result[0]?.meta[0]?.total || 0;
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      media: data,
      totalPages: totalPages
    }
  }
  async getTrailer() {
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
                "anilistData.trailer": anime.trailer,
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
