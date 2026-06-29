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
var BotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path_1 = require("path");
const mongoose_1 = require("mongoose");
const episode_schema_1 = require("../schema/episode.schema");
const anime_schema_1 = require("../schema/anime.schema");
const mongoose_2 = require("@nestjs/mongoose");
let BotService = BotService_1 = class BotService {
    episodeModel;
    animeModel;
    logger = new common_1.Logger(BotService_1.name);
    constructor(episodeModel, animeModel) {
        this.episodeModel = episodeModel;
        this.animeModel = animeModel;
    }
    async saveEpisodeToDB(id, episodeResults) {
        const operations = episodeResults.flatMap((item) => {
            const tenProvider = "animevietsub";
            const idCuaEpisode = item.episodeId;
            const newServers = [
                { name: "DU", url: item.Du },
                { name: "EMBED", url: item.Embed }
            ].filter(srv => srv.url !== null && srv.url !== undefined);
            return [
                {
                    updateOne: {
                        filter: { anilistId: id, episodeNumber: item.title },
                        update: {
                            $setOnInsert: { anilistId: id, episodeNumber: item.title, sources: [] }
                        },
                        upsert: true
                    }
                },
                {
                    updateOne: {
                        filter: { anilistId: id, episodeNumber: item.title },
                        update: [
                            {
                                $set: {
                                    sources: {
                                        $cond: {
                                            if: { $not: { $in: [tenProvider, { $ifNull: ["$sources.provider", []] }] } },
                                            then: {
                                                $concatArrays: [
                                                    { $ifNull: ["$sources", []] },
                                                    [
                                                        {
                                                            provider: tenProvider,
                                                            episodeId: idCuaEpisode,
                                                            servers: newServers
                                                        }
                                                    ]
                                                ]
                                            },
                                            else: {
                                                $map: {
                                                    input: "$sources",
                                                    as: "src",
                                                    in: {
                                                        $cond: {
                                                            if: { $eq: ["$$src.provider", tenProvider] },
                                                            then: {
                                                                $mergeObjects: [
                                                                    "$$src",
                                                                    {
                                                                        episodeId: idCuaEpisode,
                                                                        servers: {
                                                                            $concatArrays: [
                                                                                {
                                                                                    $filter: {
                                                                                        input: { $ifNull: ["$$src.servers", []] },
                                                                                        as: "srv",
                                                                                        cond: { $not: { $in: ["$$srv.name", ["DU", "EMBED"]] } }
                                                                                    }
                                                                                },
                                                                                newServers
                                                                            ]
                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                            else: "$$src"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ];
        });
        try {
            await this.episodeModel.bulkWrite(operations, { ordered: false });
        }
        catch (error) {
            console.log(error);
            console.log("Khong co tap moi bo qua");
        }
    }
    async saveProviderStatus(anilistId, status) {
        await this.animeModel.updateOne({
            anilistId: anilistId,
            "mappings.provider": "animevietsub"
        }, {
            $set: {
                "mappings.$.providerStatus": status
            }
        });
    }
    async triggerBotCrawl() {
        return new Promise((res, rej) => {
            const botPath = (0, path_1.resolve)(__dirname, '..', '..', 'updateEpisodeV2.mjs');
            this.logger.log(`[NestJS] Khởi tạo child_process chạy bot tại: ${botPath}`);
            const child = (0, child_process_1.fork)(botPath, [], {
                env: {
                    ...process.env,
                    MONGOOSE_URI: process.env.MONGOOSE_URI
                },
                silent: false,
            });
            child.send({ start: true });
            child.on("spawn", () => {
                console.log("BOT SPAWNED");
            });
            child.on('message', async (response) => {
                if (response.success) {
                    this.logger.log('[NestJS] Bot đã cào xong và trả dữ liệu về thành công');
                    const dataCrawled = response.data;
                    if (dataCrawled?.episodes.length > 0) {
                        console.log(dataCrawled);
                        await this.saveEpisodeToDB(dataCrawled.anilistId, dataCrawled.episodes);
                        console.log("Luu thanh cong");
                        await this.saveProviderStatus(dataCrawled.anilistId, dataCrawled.providerStatus);
                    }
                }
                else {
                    rej(new Error(response.error || 'Bot báo lỗi không rõ nguyên nhân'));
                }
            });
            child.on('error', (err) => {
                this.logger.error('[NestJS] Tiến trình bot gặp lỗi hệ thống:', err);
                rej(err);
            });
            child.on('exit', (code) => {
                this.logger.log(`[NestJS] Tiến trình bot đã đóng hoàn toàn (Exit code: ${code})`);
            });
        });
    }
};
exports.BotService = BotService;
exports.BotService = BotService = BotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(episode_schema_1.Episode.name)),
    __param(1, (0, mongoose_2.InjectModel)(anime_schema_1.Anime.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], BotService);
//# sourceMappingURL=bot.sync.service.js.map