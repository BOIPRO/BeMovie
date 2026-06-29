"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WakeupTimeController = exports.CronJobController = exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./services/movies.service");
const bot_sync_service_1 = require("./services/bot.sync.service");
const get_anime_dto_1 = require("../common/dto/get-anime.dto");
const get_stream_dto_1 = require("../common/dto/get-stream-dto");
const search_anime_dto_1 = require("../common/dto/search-anime.dto");
const get_trending_anime_dto_1 = require("../common/dto/get-trending-anime.dto");
const stream_service_1 = require("./services/stream.service");
let MoviesController = class MoviesController {
    moviesService;
    streamService;
    constructor(moviesService, streamService) {
        this.moviesService = moviesService;
        this.streamService = streamService;
    }
    async getAnimes(query) {
        const dataPage = await this.moviesService.getPageAnimes(`page:${query.page}`, query.page, query.limit);
        return dataPage;
    }
    async searchAnime(query) {
        const data = await this.moviesService.searchAnime(query.s, query.page, query.limit);
        return data;
    }
    async getTrendingAnime(query) {
        const dataTrending = await this.moviesService.getAnimeData(query.amount, 'trending');
        return dataTrending;
    }
    async getHomePage() {
        const activeLists = ['banner', 'trending', 'popularity', 'animeOfTheYear'];
        const limit = 10;
        return await this.moviesService.getMultipleAnimeLists(limit, activeLists);
    }
    async getAnimeEpisode(id) {
        return await this.streamService.getAnimeEpisodes(id);
    }
    async GetInfoAnime(id) {
        return (await this.moviesService.findOneAnime(id));
    }
    async getStreamAnime(query, res) {
        const data = await this.streamService.getStreamingLink(query.anilistId, query.episodeSlug, query.provider, query.server);
        const m3u8Content = typeof data === 'object' ? data.m3u8 : data;
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(m3u8Content);
    }
    async test() {
        return await this.streamService.getTokenUser();
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)('page'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_anime_dto_1.GetAnime]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getAnimes", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_anime_dto_1.SearchAnime]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "searchAnime", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_trending_anime_dto_1.GetTrendingAnime]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getTrendingAnime", null);
__decorate([
    (0, common_1.Get)('home'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getHomePage", null);
__decorate([
    (0, common_1.Get)('episodes'),
    __param(0, (0, common_1.Query)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getAnimeEpisode", null);
__decorate([
    (0, common_1.Get)('info'),
    __param(0, (0, common_1.Query)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "GetInfoAnime", null);
__decorate([
    (0, common_1.Get)('stream'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_stream_dto_1.GetStreamQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getStreamAnime", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "test", null);
exports.MoviesController = MoviesController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService,
        stream_service_1.StreamService])
], MoviesController);
let CronJobController = class CronJobController {
    botService;
    constructor(botService) {
        this.botService = botService;
    }
    async UpdateData() {
        this.botService.triggerBotCrawl();
        return "Success";
    }
};
exports.CronJobController = CronJobController;
__decorate([
    (0, common_1.Get)('update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "UpdateData", null);
exports.CronJobController = CronJobController = __decorate([
    (0, common_1.Controller)('cronjob'),
    __metadata("design:paramtypes", [bot_sync_service_1.BotService])
], CronJobController);
let WakeupTimeController = class WakeupTimeController {
    async wakeuptime() {
        return "Success";
    }
};
exports.WakeupTimeController = WakeupTimeController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WakeupTimeController.prototype, "wakeuptime", null);
exports.WakeupTimeController = WakeupTimeController = __decorate([
    (0, common_1.Controller)('wakeuptime')
], WakeupTimeController);
//# sourceMappingURL=movies.controller.js.map