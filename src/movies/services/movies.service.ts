import { Injectable } from '@nestjs/common';
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

  async getTrendingAnimes(key: string, limit: number) {
    const dataTrending = await this.redisService.get(key);
    if (dataTrending) {
      return dataTrending;
    }
    else {
      const expiretime = 300
      const data = await this.movieModel.find().sort({ trending: -1 }).select('anilistId titleRomaji titleEnglish coverImage description').limit(limit).lean().exec()
      await this.redisService.set(key, JSON.stringify(data), expiretime)
      return data
    }
  }

  async getPageAnimes(key: string, page: number, limit: number) {
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

  async getPage(page: number = 1, limit: number = 30) {
    const skip = (page - 1) * limit;
    const [data,totalPages] = await Promise.all([
      this.movieModel
        .find()
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(limit)
        .select('anilistId titleRomaji titleEnglish coverImage description')
        .lean()
        .exec(),
      this.movieModel.countDocuments({ popularity: { $gt: 200000 } })
    ])
    return {
      media : data,
      totalPages : totalPages
    }
  }

  async searchAnime(search?: string, page: number = 1, limit: number = 30) {
    const skip = (page - 1) * limit;
    const result = await
      this.movieModel.aggregate([
        {
          $search: {
            index: "searchanime",
            text: {
              query: search,
              path: ["titleRomaji","titleEnglish"]
            },
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
    media : data,
    totalPages : totalPages
   }
  }

}
