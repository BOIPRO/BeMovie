import { Injectable, Logger } from '@nestjs/common';
import { fork } from 'child_process';
import { resolve } from 'path';
import { Model } from 'mongoose';
import { Episode } from "../schema/episode.schema";
import { Anime } from "../schema/anime.schema";
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name);
    constructor(
        @InjectModel(Episode.name)
        private episodeModel: Model<Episode>,
        @InjectModel(Anime.name)
        private animeModel: Model<Anime>
    ) { }
    // constructor(private readonly moviesService: MoviesService) {}
    async saveEpisodeToDB(id: number, episodeResults: any) {
        const operations = episodeResults.flatMap((item) => {
            const tenProvider = "animevietsub";
            const idCuaEpisode = item.episodeId;
            const newServers = [
                { name: "DU", url: item.Du },       // Giá trị urlDu lấy từ kết quả fetch trước đó
                { name: "EMBED", url: item.Embed }   // Giá trị urlEmbed lấy từ kết quả fetch trước đó
            ].filter(srv => srv.url !== null && srv.url !== undefined); // Chỉ lấy server có link thực tế
            return [
                // LỆNH 1: Tạo khung tập phim nếu chưa có (Giữ nguyên cho an toàn)
                {
                    updateOne: {
                        filter: { anilistId: id, episodeNumber: item.title },
                        update: {
                            $setOnInsert: { anilistId: id, episodeNumber: item.title, sources: [] }
                        },
                        upsert: true
                    }
                },

                // LỆNH 2: CẬP NHẬT ĐỒNG THỜI CẢ PROVIDER VÀ SERVER
                {
                    updateOne: {
                        filter: { anilistId: id, episodeNumber: item.title },
                        update: [
                            {
                                $set: {
                                    sources: {
                                        $cond: {
                                            // Sửa lỗi 1: Đảm bảo $sources tồn tại bằng cách bọc $ifNull để tránh lỗi null mảng
                                            if: { $not: { $in: [tenProvider, { $ifNull: ["$sources.provider", []] }] } },

                                            // TH1: CHƯA CÓ PROVIDER -> Tạo mới nguyên cụm
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

                                            // TH2: ĐÃ CÓ PROVIDER -> Duyệt mảng sources để sửa bên trong
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
                                                                                        // Sửa lỗi 2: Dọn dẹp sạch toàn bộ server cũ tên "DU" hoặc "EMBED"
                                                                                        cond: { $not: { $in: ["$$srv.name", ["DU", "EMBED"]] } }
                                                                                    }
                                                                                },
                                                                                // Đẩy mảng mới vào sau khi đã dọn dẹp đồ cũ
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
        } catch (error) {
            console.log(error)
            console.log("Khong co tap moi bo qua")
        }
    }
    async saveProviderStatus(anilistId, status) {
        await this.animeModel.updateOne(
            {
                anilistId: anilistId,
                "mappings.provider": "animevietsub"
            },
            {
                $set: {
                    "mappings.$.providerStatus": status
                }
            }

        )
    }
    async triggerBotCrawl(): Promise<any> {
        return new Promise((res, rej) => {
            // Đường dẫn trỏ vào file .mjs trong thư mục dist/bots
            const botPath = resolve(__dirname, '..', '..', 'updateEpisodeV2.mjs');

            this.logger.log(`[NestJS] Khởi tạo child_process chạy bot tại: ${botPath}`);

            // Tạo tiến trình độc lập hoàn toàn ngoài OS
            const child = fork(botPath, [], {
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

            // 2. Nhận mảng dữ liệu phim từ bot gửi về
            child.on('message', async (response: any) => {
                if (response.success) {
                    this.logger.log('[NestJS] Bot đã cào xong và trả dữ liệu về thành công');
                    const dataCrawled = response.data;
                    if (dataCrawled?.episodes.length > 0) {
                        console.log(dataCrawled)
                          await this.saveEpisodeToDB(dataCrawled.anilistId,dataCrawled.episodes);
                          console.log("Luu thanh cong")
                        await this.saveProviderStatus(dataCrawled.anilistId,dataCrawled.providerStatus)
                    }
                } else {
                    rej(new Error(response.error || 'Bot báo lỗi không rõ nguyên nhân'));
                }
            });

            // 3. Lắng nghe nếu tiến trình con bị crash đột xuất
            child.on('error', (err) => {
                this.logger.error('[NestJS] Tiến trình bot gặp lỗi hệ thống:', err);
                rej(err);
            });

            // 4. Khi tiến trình con kết thúc (process.exit)
            child.on('exit', (code) => {
                this.logger.log(`[NestJS] Tiến trình bot đã đóng hoàn toàn (Exit code: ${code})`);
            });
        });
    }
}