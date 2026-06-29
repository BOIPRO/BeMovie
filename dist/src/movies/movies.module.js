"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesModule = void 0;
const common_1 = require("@nestjs/common");
const movies_controller_1 = require("./movies.controller");
const movies_service_1 = require("./services/movies.service");
const axios_1 = require("@nestjs/axios");
const bot_sync_service_1 = require("./services/bot.sync.service");
const mongoose_1 = require("@nestjs/mongoose");
const anime_schema_1 = require("./schema/anime.schema");
const movie_schema_1 = require("./schema/movie.schema");
const stream_service_1 = require("./services/stream.service");
const decryptm3u8_service_1 = require("./services/decryptm3u8.service");
const episode_schema_1 = require("./schema/episode.schema");
let MoviesModule = class MoviesModule {
};
exports.MoviesModule = MoviesModule;
exports.MoviesModule = MoviesModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([
                { name: anime_schema_1.Anime.name, schema: anime_schema_1.AnimeSchema },
                { name: episode_schema_1.Episode.name, schema: episode_schema_1.EpisodeSchema },
                { name: movie_schema_1.Movie.name, schema: movie_schema_1.MovieSchema },
            ]),
        ],
        controllers: [movies_controller_1.MoviesController, movies_controller_1.CronJobController, movies_controller_1.WakeupTimeController],
        providers: [movies_service_1.MoviesService, bot_sync_service_1.BotService, stream_service_1.StreamService, decryptm3u8_service_1.DecryptService],
        exports: [decryptm3u8_service_1.DecryptService]
    })
], MoviesModule);
//# sourceMappingURL=movies.module.js.map