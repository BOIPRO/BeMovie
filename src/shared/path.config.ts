import { resolve } from 'path';

const ROOT_PROJECT = process.cwd(); 

export const PATHS = {
    // Dev enviroment
    BOT_WORKER_DEV: resolve(ROOT_PROJECT, 'src/movies/bots/metadata.bot.mjs'),
     BOT_WORKER_PRODUCT: resolve(ROOT_PROJECT, 'dist/movies/bots/metadata.bot.mjs'),
};