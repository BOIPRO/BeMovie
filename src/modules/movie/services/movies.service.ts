import { Injectable, NotFoundException } from '@nestjs/common';
// import { RedisService } from 'src/common/redis/redis.service';
import { MovieRepository } from '../repository/movie.repository';
@Injectable()
export class MoviesService {
    constructor (
      private readonly movieRepository : MovieRepository
    ) {}
      async getPopularityPageAnimes(page: number, limit: number): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const data = await this.movieRepository.getPopularityPage(page, limit);
    return data
  }
   async getYearPageAnimes(page: number, limit: number): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const data = await this.movieRepository.getYearPage(page, limit);
    return data
  }
  async searchAnime(search?: string, page: number = 1, limit: number = 30): Promise<{
    media: any[];
    totalPages: number;
  }> {
    const infoListSearchAnime = await this.movieRepository.searchAnime(search,page,limit)
    return infoListSearchAnime
  }
   async getMultipleAnimeLists(limit: number) {
   const [listBanner,listTrending,listPopularity,listAnimesOfYear,listAnimeReleasing] = await Promise.all([
    this.movieRepository.getListBanner(),
    this.movieRepository.getListTrending(limit),
    this.movieRepository.getListPopularity(limit),
    this.movieRepository.getListAnimeOfTheYear(limit),
    this.movieRepository.getListAnimeReleasing(limit)
   ])
   return {
    banner : listBanner,
    trending : listTrending,
    popularity : listPopularity,
    animeOfTheYear : listAnimesOfYear,
    animeReleasing : listAnimeReleasing
   }
  }
  async findOneAnime (id : number) {
    return await this.movieRepository.findOne(id)
  }
  async getBannerImage() {
    return await this.movieRepository.getBannerImage()
  }
  async suggestAnime(search?: string) { 
    return await this.movieRepository.suggest(search)
  }
}
