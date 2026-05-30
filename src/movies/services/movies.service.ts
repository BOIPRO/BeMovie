import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { Model } from 'mongoose';
import { Movie } from "../schema/movie.schema";
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class MoviesService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Movie.name)
    private movieModel: Model<Movie>
  ) { }

  async getTrendingAnimes(key: string, limit: number): Promise<Partial<Movie>[]> {
    const dataTrending = await this.redisService.get(key);
    if (dataTrending) {
      return dataTrending;
    }
    else {
      const expiretime = 300
      const data = await this.movieModel.find({isPublished : true}).sort({ trending: -1}).select('slug idMal titleRomaji titleEnglish coverImage description').limit(limit).lean().exec()
      await this.redisService.set(key, JSON.stringify(data), expiretime)
      return data
    }
  }
  async findOneAnime(id: number): Promise<Partial<Movie>[]> {
    const data = await this.movieModel.find({ anilistId: id }).select('titleRomaji titleEnglish coverImage description averageScore genres ')
    if (!data) {
      throw new NotFoundException("Cant find anime");
    }
    return data
  }
  async getPageAnimes(key: string, page: number, limit: number): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const data = await this.redisService.get(key);
    if (data) {
      return data;
    }
    else {
      const expiretime = 300
      const data = await this.getPage(page, limit);
      await this.redisService.set(key, JSON.stringify(data), expiretime)
      return data
    }
  }

  async getPage(page: number = 1, limit: number = 30): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit
    const filter = { isPublished: true };
    const [data, totalDocuments] = await Promise.all([
      this.movieModel
        .find(filter)
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(limit)
        .select('slug titleRomaji idMal titleEnglish coverImage description')
        .lean()
        .exec(),
      this.movieModel.countDocuments(filter)
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
      this.movieModel.aggregate([
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
  async clearData() {

  }
}
