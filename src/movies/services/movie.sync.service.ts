// Crawl Data and cronJob
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "../schema/movie.schema";
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sleep } from "src/common/utils/sleep";
import axios from 'axios';
@Injectable()
export class MovieSyncService {
    private readonly logger = new Logger(MovieSyncService.name);
    private readonly ANILIST_URL = 'https://graphql.anilist.co';
    constructor(
        @InjectModel(Movie.name)
        private movieModel: Model<Movie>) { }
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleSync() {
        this.logger.log('Ready for crawling');
        await this.CrawlMovie();
    }
    async CrawlMovie() {
        let currentPage = 1;
        let hasNextPage = true;
        // Cron Job work
        while (hasNextPage) {
            try {
                this.logger.log(`Server is crawling at page ${currentPage}...`);

                const response = await this.fetchFromAniList(currentPage);
                const { media, pageInfo } = response.data.data.Page;

                if (media.length > 0) {
                    await this.saveToDb(media);
                }

                hasNextPage = pageInfo.hasNextPage;
                currentPage++;
                await sleep(2000);

            } catch (error: any) {
                this.logger.error(`Error at page ${currentPage}: ${error.message}`);
                if (error.response?.status === 429) {
                    this.logger.warn('limit sppeed');
                    await sleep(60000);
                } else {
                    break;
                }
            }
        }
        this.logger.log('Succes');
    }

    private async fetchFromAniList(page: number) {
        const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo { hasNextPage }
          media(type: ANIME, sort: UPDATED_AT_DESC,isAdult: false,genre_not_in: ["Ecchi"],) {
            id
            idMal
            title { english romaji }
            coverImage { large }
            genres
            averageScore
            description
            popularity
            trending
            updatedAt
            isAdult
            relations {
        edges {
          relationType
          node {
            id
            idMal
            title {
              romaji
              english
            }
            format 
            type  
            status
            coverImage { large }
          }
        }
      }
          }
        }
      }
    `;
        return axios.post(this.ANILIST_URL, { query, variables: { page } });
    }
    // Save Mongoose
    private async saveToDb(media: any[]) {
    
        const operations = media.map((item) => {
            const formattedRelations = item.relations?.edges
            ? item.relations.edges
                .filter((edge: any) => edge.node.type === 'ANIME') 
                .map((edge: any) => ({
                    relationType: edge.relationType,
                    anilistId: edge.node.id,
                    idMal: edge.node.idMal,
                    title: {
                        romaji: edge.node.title.romaji,
                        english: edge.node.title.english,
                    },
                    format: edge.node.format,
                    status: edge.node.status,
                    coverImage: edge.node.coverImage?.medium,
                }))
            : [];
            return {
                 updateOne: {
                filter: { anilistId: item.id },
                update: {
                    $set: {
                        idMal : item.idMal,
                        titleRomaji: item.title.romaji,
                        titleEnglish: item.title.english,
                        coverImage: item.coverImage.large,
                        genres: item.genres,
                        averageScore: item.averageScore,
                        popularity: item.popularity,
                        trending: item.trending,
                        description: item.description,
                        anilistUpdatedAt: item.updatedAt,
                        isAdult: item.isAdult,
                        relations: formattedRelations,
                    },
                },
                upsert: true,
            },
            }
           
        });

        await this.movieModel.bulkWrite(operations, { ordered: false });
    }
}