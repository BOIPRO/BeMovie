"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const episode_schema_1 = require("../schema/episode.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const decryptm3u8_service_1 = require("./decryptm3u8.service");
let StreamService = class StreamService {
    episodeModel;
    decryptService;
    constructor(episodeModel, decryptService) {
        this.episodeModel = episodeModel;
        this.decryptService = decryptService;
    }
    async getAnimeEpisodes(id) {
        const listEpsiode = await this.episodeModel.find({ anilistId: id }).select("episodeSlug episodeNumber");
        return listEpsiode;
    }
    async getTokenUser() {
        try {
            const res = await axios_1.default.get('https://animevietsub.pl', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
                    'Referer': 'https://animevietsub.pl/',
                    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Cookies': "https://animevietsub.pl"
                }
            });
            const data = res.data;
            const regex = /token:"([^"]+)"/;
            const match = data.match(regex);
            if (match && match[1]) {
                return match[1];
            }
            else {
                console.log("Không tìm thấy token trong trang web.");
            }
        }
        catch (error) {
            console.error("Lỗi khi fetch:", error.message);
        }
    }
    async getStreamingLink(anilistId, episodeSlug, provider, server) {
        const filter = {
            episodeSlug: episodeSlug,
            anilistId: anilistId,
            "sources.provider": provider
        };
        const episode = await this.episodeModel
            .findOne(filter)
            .select("sources")
            .lean()
            .exec();
        if (!episode) {
            return "";
        }
        const targetProvider = episode.sources.find(s => s.provider === provider);
        const targetServer = targetProvider?.servers.find(s => s.name == server);
        if (server == "DU") {
            const url = targetServer?.url;
            if (url) {
                console.log(url);
                return await this.getDecodeM3U8(url);
            }
            else {
                const episodeId = targetProvider?.episodeId;
                console.log(episodeId);
                if (!episodeId) {
                    return "";
                }
                const res = await this.getURIEpisode(episodeId);
                const id = res.link.split('/').pop();
                this.saveStreamId(episode._id, episodeId, provider, id, server);
                console.log(id);
                return await this.getDecodeM3U8(id);
            }
        }
        console.log("Ko vao trong server");
        return '';
    }
    async saveStreamId(id, episodeId, tenProvider, url, server) {
        const newServers = [{
                name: server,
                url: url,
            }
        ];
        await this.episodeModel.updateOne({ _id: id, "sources.provider": tenProvider }, [
            {
                $set: {
                    sources: {
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
                                                episodeId: episodeId,
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
        ], { updatePipeline: true });
    }
    parseServers(responseData) {
        const $ = cheerio.load(responseData.html);
        const serverList = [];
        $('a.btn3dsv').each((index, element) => {
            const serverName = $(element).text().trim();
            const serverId = $(element).attr('data-id');
            const playType = $(element).attr('data-play');
            const encryptedHref = $(element).attr('data-href');
            serverList.push({
                name: serverName,
                id: serverId,
                type: playType,
                token: encryptedHref
            });
        });
        return serverList;
    }
    async getStreamLinkAVS(serverDu) {
        const API_URL = 'https://animevietsub.pl/ajax/player';
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest'
        };
        try {
            const payload = {
                link: serverDu.token,
                play: serverDu.type,
                id: serverDu.id,
                backuplinks: '1'
            };
            const ajaxHeaders = {
                ...baseHeaders,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            const response = await axios_1.default.post(API_URL, payload, {
                headers: ajaxHeaders,
                transformRequest: [(data) => {
                        const dataObj = data;
                        return Object.entries(dataObj).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
                    }]
            });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            }
            else {
                console.error("Lỗi kết nối AJAX:", error.message);
            }
        }
    }
    async getURIEpisode(episodeId) {
        const API_URL = 'https://animevietsub.pl/ajax/player';
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest'
        };
        const payload = {
            episodeId: String(episodeId),
            backup: '1'
        };
        try {
            const response = await axios_1.default.post(API_URL, payload, {
                headers: baseHeaders,
                transformRequest: [(data) => {
                        const dataObj = data;
                        return Object.entries(dataObj).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
                    }]
            });
            const serverList = this.parseServers(response.data);
            const serverDU = serverList.find(server => server.name.includes('DU'));
            if (!serverDU) {
                throw new common_1.NotFoundException("Không tìm thấy server DU trong danh sách.");
            }
            return await this.getStreamLinkAVS(serverDU);
        }
        catch (error) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            }
            else {
                console.log(error);
                console.error(" Lỗi kết nối AJAX:", error.message);
            }
        }
    }
    async getDecodeM3U8(idStream) {
        const API_URL = `https://storage.googleapiscdn.com/playlist/${idStream}/playlist.m3u8`;
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest',
            'referer': `https://storage.googleapiscdn.com/playlist/${idStream}`
        };
        try {
            const response = await axios_1.default.get(API_URL, {
                headers: baseHeaders
            });
            const rawData = await this.decryptService._0x1cf828(String(response.data), response.headers);
            return rawData;
        }
        catch (error) {
            if (error.response) {
                console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
            }
            else {
                console.error(" Lỗi kết nối AJAX:", error.message);
            }
        }
    }
};
exports.StreamService = StreamService;
exports.StreamService = StreamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(episode_schema_1.Episode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        decryptm3u8_service_1.DecryptService])
], StreamService);
//# sourceMappingURL=stream.service.js.map