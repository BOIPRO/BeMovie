"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATHS = void 0;
const path_1 = require("path");
const ROOT_PROJECT = process.cwd();
exports.PATHS = {
    METADATA_WORKER_PRODUCT: (0, path_1.resolve)(ROOT_PROJECT, 'dist/metadata.bot.mjs'),
    CHECKDATA_WORKER_PRODUCT: (0, path_1.resolve)(ROOT_PROJECT, 'dist/checkdata.bot.mjs'),
};
//# sourceMappingURL=path.config.js.map