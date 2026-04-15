import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    constructor(
        private readonly redisService: RedisService,
        private readonly httpService: HttpService
    ) { }
    async getAnimes(key: string, page: number) {
        const data = await this.redisService.get(key);
        if (data) {
            return data;
        }
        else {
            const url = 'https://graphql.anilist.co';
            const variables = {
                page: page
            };
            const query = ` query ($page: Int) { 
            list: Page(page: $page, perPage: 30) {
                media(sort: POPULARITY_DESC) {
                    id
                    title { romaji }
                    coverImage { large }
                }
            }
        }
  `;
            try {
                // convert to Promise by firstValueForm
                const { data } = await firstValueFrom(
                    this.httpService.post(url, { query,variables: variables })
                )
                this.redisService.set(key,data)
                return data;
            } catch (error) {
                throw new Error("Can't call api");
            }
        }
    }
}
