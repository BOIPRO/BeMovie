import mongoose, { Schema } from 'mongoose';
import axios from 'axios';
import slugify from 'slugify';
import { ConnectModel,Movies } from './db.mjs';
const createSlug = (text) => {
    return slugify(text, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
    });
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const ANILIST_URL = 'https://graphql.anilist.co';
const fetchFromAniList = async (page) => {
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo { hasNextPage }
          media(
          type: ANIME,
            sort: UPDATED_AT_DESC
            isAdult: false,
            genre_not_in: ["Ecchi"],
            format_in: [TV, MOVIE, OVA, ONA],
            status_in: [RELEASING, NOT_YET_RELEASED,FINISHED]
            idMal_not: null,
            popularity_greater: 500
            ) {
            id
            idMal
            title { english romaji }
            coverImage { large }
            genres
            averageScore
            description
            status
            popularity
            trending
            updatedAt
            isAdult
            episodes
            nextAiringEpisode {
            episode
            }
          }
        }
      }
    `;
    return axios.post(ANILIST_URL, { query, variables: { page } });
}
const saveToDb = async (Movies, media) => {

    const operations = media.map((item) => {
        return {
            updateOne: {
                filter: {
                    anilistId: item.id
                },
                update: {
                    $set: {
                        idMal: item.idMal,
                        titleRomaji: item.title.romaji,
                        titleEnglish: item.title.english,
                        coverImage: item.coverImage.large,
                        genres: item.genres,
                        averageScore: item.averageScore,
                        popularity: item.popularity,
                        trending: item.trending,
                        description: item.description,
                        anilistUpdatedAt: item.updatedAt,
                        slug: createSlug(`${item.title.romaji}-${item.id}`),
                        isAdult: item.isAdult,
                        lastChecked: new Date(),
                        episodes : item.episodes,
                        status : item.status,
                        nextAiringEpisode : item.nextAiringEpisode
                    },
                },
                upsert: true,
            }
        }
    })
    await Movies.bulkWrite(operations, { ordered: false });
}
const CrawlMovie = async (Movies) => {
    let currentPage = 1;
    let hasNextPage = true;
    // Cron Job work
    while (hasNextPage) {
        try {
            console.log(`Server is crawling at page ${currentPage}...`);

            const response = await fetchFromAniList(currentPage);
            const { media, pageInfo } = response.data.data.Page;

            if (media.length > 0) {
                await saveToDb(Movies, media);
            }

            hasNextPage = pageInfo.hasNextPage;
            currentPage++;
            await sleep(3000);

        } catch (error) {
            console.error(`Error at page ${currentPage}: ${error.message}`);
            if (error.response?.status === 429) {
                console.warn('limit sppeed');
                await sleep(60000);
            } else {
                break;
            }
        }
    }
    console.log('Succes');
}
const handleAsync = async (config) => {
    await ConnectModel(config)
    await CrawlMovie(Movies);
}
export default handleAsync