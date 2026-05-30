import { resolve } from 'path';

const ROOT_PROJECT = process.cwd(); 

export const PATHS = {
    // Dev enviroment
    METADATA_WORKER_DEV: resolve(ROOT_PROJECT, 'src/movies/bots/metadata.bot.mjs'),
    METADATA_WORKER_PRODUCT: resolve(ROOT_PROJECT, 'dist/movies/bots/metadata.bot.mjs'),
    CHECKDATA_WORKER_DEV: resolve(ROOT_PROJECT, 'src/movies/bots/checkdata.bot.mjs'),
    CHECKDATA_WORKER_PRODUCT: resolve(ROOT_PROJECT, 'dist/movies/bots/checkdata.bot.mjs'),
};