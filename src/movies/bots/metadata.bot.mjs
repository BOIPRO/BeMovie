import mongoose, { Schema } from 'mongoose';
import axios from 'axios';
import slugify from 'slugify';
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
const moviesSchema = new Schema({
    anilistId: { type: Number, required: true, unique: true },
    idMal: { type: Number, required: true },
    titleRomaji: { type: String, required: true, index: true },
    slug: { type: String, unique: true, index: true },
    titleEnglish: { type: String },
    coverImage: { type: String },
    genres: { type: [String], index: true },
    averageScore: { type: Number, index: true },
    popularity: { type: Number, index: true },
    trending: { type: Number, index: true },
    description: { type: String },
    status: { type: String, default: 'FINISHED' },
    anilistUpdatedAt: { type: Number, index: true },
    isAdult: { type: Boolean },
    isPublished: { type: Boolean, default: false, index: true }
})
const ConnectModel = async (config) => {
    const { dbUrl } = config
    console.log(dbUrl)
    await mongoose.connect(`${dbUrl}test`)
}

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
    return axios.post(ANILIST_URL, { query, variables: { page } });
}
const saveToDb = async (Movies, media) => {

    const operations = media.map((item) => {
        return {
            updateOne: {
                filter: {
                    $or: [
                        { anilistId: item.id },
                        { slug: createSlug(`${item.title.romaji}-${item.id}`) }
                    ]
                },
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
                    isAdult: item.isAdult,

                },
            },
            upsert: true,
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
            await sleep(1000);

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
    const Movies = mongoose.model('movies', moviesSchema)
    await CrawlMovie(Movies);
}
export default handleAsync