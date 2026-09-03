import { Injectable, NotFoundException } from '@nestjs/common';
// import { RedisService } from 'src/common/redis/redis.service';
import { MovieRepository } from '../repository/movie.repository';
@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository
  ) { }
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
    const infoListSearchAnime = await this.movieRepository.searchAnime(search, page, limit)
    return infoListSearchAnime
  }
  async getMultipleAnimeLists(limit: number) {
    const [listBanner, listTrending, listPopularity, listAnimesOfYear, listAnimeReleasing] = await Promise.all([
      this.movieRepository.getListBanner(),
      this.movieRepository.getListTrending(limit),
      this.movieRepository.getListPopularity(limit),
      this.movieRepository.getListAnimeOfTheYear(limit),
      this.movieRepository.getListAnimeReleasing(limit)
    ])
    return {
      banner: listBanner,
      trending: listTrending,
      popularity: listPopularity,
      animeOfTheYear: listAnimesOfYear,
      animeReleasing: listAnimeReleasing
    }
  }
  async getAllAnimes() {
    return await this.movieRepository.getAllAnimes()
  }
  async findOneAnime(id: number) {
  const animeDetails = await this.movieRepository.findOne(id);

  if (!animeDetails) {
    return null;
  }

  // Sắp xếp tất cả relation theo ngày phát hành
  const relations = [...(animeDetails.relation ?? [])].sort((a, b) => {
    const dateA = new Date(
      a.anilistData?.startDate?.year ?? 9999,
      (a.anilistData?.startDate?.month ?? 1) - 1,
      a.anilistData?.startDate?.day ?? 1,
    ).getTime();

    const dateB = new Date(
      b.anilistData?.startDate?.year ?? 9999,
      (b.anilistData?.startDate?.month ?? 1) - 1,
      b.anilistData?.startDate?.day ?? 1,
    ).getTime();

    return dateA - dateB;
  });

  // Đếm riêng từng format
  const formatCount: Record<string, number> = {};

  const formatName: Record<string, string> = {
    TV: "TV Series",
    TV_SHORT: "TV Series",
    ONA: "ONA",
    MOVIE: "Movie",
    SPECIAL: "Special",
    OVA: "OVA",
    SIDE_STORY: "Side Story",
    SPIN_OFF: "Spin-off",
  };

  const sortedRelations = relations.map((item) => {
    const format = item.anilistData?.format;

    if (!format) {
      return {
        ...item,
        part: "Khác",
        type: "OTHER",
      };
    }

    // TV và TV_SHORT được tính chung
    const countKey =
      format === "TV" || format === "TV_SHORT"
        ? "TV"
        : format;

    formatCount[countKey] = (formatCount[countKey] ?? 0) + 1;

    const name = formatName[format] ?? format;

    // Chỉ có 1 TV/TV_SHORT
    if (countKey === "TV" && formatCount[countKey] === 1) {
      return {
        ...item,
        part: "Phần TV Series",
        type: "MAIN",
      };
    }

    return {
      ...item,
      part: `Phần ${name} ${formatCount[countKey]}`,
      type: format,
    };
  });

  return {
    ...animeDetails,
    relation: sortedRelations,
  };
}
  async getBannerImage() {
    return await this.movieRepository.getBannerImage()
  }
  async suggestAnime(search?: string) {
    return await this.movieRepository.suggest(search)
  }
}
