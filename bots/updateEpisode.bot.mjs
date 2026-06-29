import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { ConnectModel, Episodes, Animes } from './db.mjs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import * as cheerio from 'cheerio';
const EpisodesModel = Episodes;
const AnimeModel = Animes
puppeteer.use(StealthPlugin());

const SERIES_URL = process.argv[2] || 'https://animevietsub.by/phim/aishiteru-game-wo-owarasetai-a5913/';
const OUTPUT_FILE = process.argv[3] || 'episodes.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const generateSlug = (episode) => {
    const cleanEpisode = episode
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/\./g, '-')
        .replace(/[^a-z0-9-]/g, '');
    return `tap-${cleanEpisode}`;
};
const normalizeEpisodes = (items) => {
    const seen = new Set();
    return items
        .map((item) => ({
            title: String(item.title || '').trim(),
            episodeId: Number(item.episodeId)
        }))
};

const extractSeriesSlug = (seriesUrl) => {
    try {
        const pathname = new URL(seriesUrl).pathname;
        const parts = pathname.split('/').filter(Boolean);
        return parts.length ? parts[parts.length - 1] : '';
    } catch {
        return '';
    }
};

const expandEpisodeList = async (page) => {
    try {
        const clicked = await page.evaluate(() => {
            const normalizeText = (text = '') => text.toString().trim().toLowerCase();
            // const triggers = ['xem thêm', 'hiện tất cả', 'show more', 'xem tất cả', 'tất cả', 'view all'];
            const candidates = Array.from(document.querySelectorAll('.latest_eps a[href*="/tap-"]'))
            // .filter((el) => triggers.some((token) => normalizeText(el.textContent).includes(token)));
            if (!candidates.length) return false;
            candidates[0].click();
            return true;
        });
        if (clicked) {
            console.log('Clicked expand button, waiting for episodes to load...');
            await delay(2000);
        }
    } catch (e) {
        // ignore if expand button is not present
    }
};

const extractAllEpisodesFromEpisodePage = async (page, episodeUrl, seriesSlug) => {
    if (!episodeUrl) return [];
    try {
        console.log(`Loading episode page: ${episodeUrl}`);
        await page.goto(episodeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(1500);

        const episodes = await page.$$eval('a[href]', (els, slug) =>
            els
                .map((el) => ({ title: el.innerText || el.textContent || '', url: el.href }))
                .filter((item) => item.url.includes(slug) && /\/tap[-_]?\d+/i.test(item.url))
            , seriesSlug);

        console.log(` Found ${episodes.length} episodes from episode page`);
        return normalizeEpisodes(episodes);
    } catch (e) {
        console.error(` Error extracting from episode page: ${e.message}`);
        return [];
    }
};

const getAllEpisodes = async (seriesUrl) => {
    
    const browser = await puppeteer.launch({ headless: true, args: 
        ['--no-sandbox','--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
 });
    const page = await browser.newPage();
    await delay(1000)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36');
    await page.setViewport({ 
    width: 1920, 
    height: 1080,
    deviceScaleFactor: 1 // Giữ nguyên tỷ lệ zoom 100% của máy tính
});
// await page.setRequestInterception(true);
// page.on('request', (request) => {
//     const url = request.url();
    
//     // Kiểm tra nếu URL chứa file khiên bảo vệ avs-shield
//     if (url.includes('://stream.googleapiscdn.com/static/avs-shield.min.js') ) {
//         console.log(`[BLOCKED] Đã chặn thành công: ${url}`);
//         request.abort(); // Chặn đứng request
//     } else {
//         request.continue(); // Cho phép các request khác đi qua
//     }
// });

    try {
        console.log(` Opening series page: ${seriesUrl}`);
        await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(1500);
        const oldUrl = page.url();
        const trangThaiText = await page.evaluate(() => {
            // Lấy tất cả các thẻ li trùng class
            const items = document.querySelectorAll('li.AAIco-adjust');

            for (let item of items) {
                const strongTag = item.querySelector('strong');
                // Kiểm tra nếu có thẻ strong và nội dung của nó là "Trạng thái:"
                if (strongTag && strongTag.textContent.includes('Trạng thái:')) {
                    // Clone lại node để không làm ảnh hưởng DOM thật nếu cần thao tác sâu
                    // Hoặc đơn giản là lấy textNode cuối cùng:
                    return item.lastChild.textContent.trim();
                    // Hoặc: return item.innerText.replace('Trạng thái:', '').trim();
                }
            }
            return null;
        });
        // Try to expand episode list first
        await expandEpisodeList(page);

        // Get all episodes from series page
        const seriesSlug = extractSeriesSlug(seriesUrl);
        const regex = /-([a-z]?\d+)\/?$/
        const match = seriesSlug.match(regex);
        const mediaId = match ? match[1] : null;
        // await page.waitForSelector('.episode', { timeout: 2000 });
        await page.waitForSelector('.list-episode', { timeout: 15000 });
        const episodesFromSeriesPage = await page.$$eval('a.episode-link', (els) =>
            els
                .map((el) => {
                    const rawTitle = String(el.innerText)
                    const rawUrl = String(el.href).trim()
                    const match = rawUrl.match(/-(\d+)\.html$/);
                    const episodeId = match ? match[1] : "";
                    return {
                        title: rawTitle,
                        episodeId: episodeId
                    };
                })
        );

        console.log(`Found ${episodesFromSeriesPage.length} episodes on series page`);

        // Try to get full episode list from first episode page
        let allEpisodes = normalizeEpisodes(episodesFromSeriesPage);


        console.log(`\n Total episodes collected: ${allEpisodes.length}`);

        // Save to file
        // await fs.writeFile(OUTPUT_FILE, JSON.stringify({
        //   provider : "animevietsub",
        //   mediaId,
        //   totalEpisodes: allEpisodes.length,
        //   episodes: allEpisodes,
        //   fetchedAt: new Date().toISOString()
        // }, null, 2), 'utf8');
        console.log('\n Episodes:');
        allEpisodes.slice(0, 10).forEach((ep, i) => {
            console.log(`  ${i + 1}. ${ep.title}`);
        });
        if (allEpisodes.length > 10) {
            console.log(`  ... and ${allEpisodes.length - 10} more episodes`);
        }

        await browser.close();
        return {
            provider: "animevietsub",
            status: trangThaiText,
            mediaId,
            totalEpisodes: allEpisodes.length,
            episodes: allEpisodes,
            fetchedAt: new Date().toISOString()
        };
    } catch (e) {
        console.error(` Error: ${e}`);
        await browser.close();
        return null;
    }
};
// const saveFinishedAnime = async (status) => {
//     await Animes.updateOne(
//         { anilistId: anime.anilistId },
//         {
//             $set: {
//                 "mappings.$.status": sourceStatus
//             }
//         },
//         { upsert: true }
//     )
// }

const saveEpisodeToDB = async (id, episodeResults) => {
    console.log(id)
    const operations = episodeResults.flatMap((item) => {
        const tenProvider ="animevietsub";
        const idCuaEpisode = item.episodeId;
        const episodeSlug = generateSlug(item.title)
        const newServers = [
            { name: "EMBED", url: item.Embed }   // Giá trị urlEmbed lấy từ kết quả fetch trước đó
        ].filter(srv => srv.url !== null && srv.url !== undefined); // Chỉ lấy server có link thực tế
        return [
            // LỆNH 1: Tạo khung tập phim nếu chưa có (Giữ nguyên cho an toàn)
            {
                updateOne: {
                    filter: { anilistId: id, episodeNumber: item.title },
                    update: {
                        $setOnInsert: { anilistId: id, episodeNumber: item.title, sources: [],episodeSlug : episodeSlug }
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
        await EpisodesModel.bulkWrite(operations, { ordered: false });
        // await EpisodesModel.bulkWrite(updateServersOps,{ordered : false})
    } catch (error) {
        console.log(error)
        console.log("Khong co tap moi bo qua")
    }
}
// [
//   {
//     "_id": "60c72b2f9b1d8b2bad123456",
//     "anilistId": 151807,
//     "mappings": [
//       { 
//         "provider": "animevietsub", 
//         "providerId": "...",
//         "sourceUrl": "https://animevietsub/phim-a.html",
//         "year": 2026
//       } 
//     ] // <--- Nguồn hh3d đã tự động bị biến mất hoàn toàn khỏi mảng này!
//   }
// ]
const saveProviderStatus = async (anilistId, status) => {
    await AnimeModel.updateOne(
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
const parseServers = (responseData) => {
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
const getServerFromToken = async (animevietsubUrl,serverEmbed) => {

    // const EPISODE_URL = 'https://animevietsub.name/phim/one-piece-dao-hai-tac-a1/xem-phim.html';
    const API_URL = `${animevietsubUrl}/ajax/player`;
    const transformFn = [(data) => Object.entries(data).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')];
    const baseHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'X-Requested-With': 'XMLHttpRequest'
    };
    let embedData = null;
    try {
        const ajaxHeaders = {
            ...baseHeaders,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': "https://animevietsub.by/phim/revenger-a4849/xem-phim.html",
        };
        await delay(500)
        if (serverEmbed) {
            try {
                const payloadEmbed = {
                    link: serverEmbed.token,
                    play: serverEmbed.type,
                    id: serverEmbed.id,
                    backuplinks: '1'
                };
                const responseEmbed = await axios.post(API_URL, payloadEmbed, {
                    headers: ajaxHeaders,
                    transformRequest: transformFn
                });
                embedData = responseEmbed.data || null;
            } catch (errEmbed) {
                console.error("Lỗi khi fetch riêng server Embed:", errEmbed.message);
            }
        } else {
            console.log("Không có cấu hình server Embed, bỏ qua fetch Embed.");
        }
        return {
            "EMBED": embedData
        };

    } catch (error) {
        if (error.response) {
            console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
        } else {
            console.error("Lỗi kết nối AJAX:", error.message);
        }
    }
}
const getSeverStreamAniemVietSub = async (animevietsubUrl, episodeId) => {
    // const EPISODE_URL = 'https://animevietsub.by/phim/one-piece-dao-hai-tac-a1/xem-phim.html';
    const API_URL = `${animevietsubUrl}/ajax/player`;
    const baseHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'X-Requested-With': 'XMLHttpRequest'
    };
    const payload = {
        episodeId: `${episodeId}`,
        backup: '1'
    };
    try {
        const response = await axios.post(API_URL, payload, {
            headers: baseHeaders,
            transformRequest: [(data) => {
                // Thao tác an toàn để ép axios gửi đúng dạng x-www-form-urlencoded
                const dataObj = data;
                return Object.entries(dataObj).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
            }]
        });
        const serverList = parseServers(response.data);
        const serverEmbed = serverList.find(server => server.name.includes('HDX'));
        if ( !serverEmbed) {
            throw new NotFoundException("Không tìm thấy cả server DU lẫn Embed trong danh sách.");
        }
        return await getServerFromToken(animevietsubUrl, serverEmbed);
    }
    catch (error) {
        if (error.response) {
            console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
        } else {
            console.log(error)
            console.error(" Lỗi kết nối AJAX:", error.message);
        }
    }
}
// {
//   Du: {
//     _fxStatus: 1,
//     success: 1,
//     title: 'AnimeVsub',
//     link: 'https://stream.googleapiscdn.com/player/5b59a5c6aad3c7167fd1eb7bdc0eb362ab2e73abe64c45c252545830a2065027',
//     playTech: 'iframe'
//   },
//   Embed: {
//     _fxStatus: 1,
//     success: 1,
//     title: 'AnimeVsub',
//     link: 'https://abyssplayer.com/2EkhcRnYC',
//     playTech: 'embed'
//   }
// }

const getIdFromUrl = (url) => {
    if (!url) return '';
    return url.split('/').pop() || '';
};
const run = async (animevietsubUrl) => {
    const data = await AnimeModel.find({
        status: "MAPPED",
        "mappings.provider": "animevietsub",
        "mappings.providerStatus": { $ne: "Completed" },

    }).select({
        anilistId: 1,
         mappings: {

            $elemMatch: { provider: "animevietsub" },

        },
        title: 1
    });
    for (const anime of data) {
        console.log(`Kiem tra anime : ${anime.title}`)
        console.log(anime.anilistId)
        const anilistId = anime.anilistId;
        const currentEpisodes = []
        const episodeCrawled = await EpisodesModel.find({ anilistId: anilistId });
        const totalEpisodes = await getAllEpisodes(`${animevietsubUrl}${anime.mappings[0].sourceUrl}`);
        if (!totalEpisodes) continue
        console.log(totalEpisodes.status)
        if (totalEpisodes.episodes.length === episodeCrawled.length) continue
        for (let i = episodeCrawled.length; i < totalEpisodes.episodes.length; i++) {
            console.log(`Dang cap nhat tap : ${i + 1}`)
            const dataServer = await getSeverStreamAniemVietSub(animevietsubUrl, totalEpisodes.episodes[i].episodeId);
            if (!dataServer) continue;
            totalEpisodes.episodes[i].Du = dataServer.DU?.link || null;
            if (totalEpisodes.episodes[i].Du)
                totalEpisodes.episodes[i].Du = getIdFromUrl(totalEpisodes.episodes[i].Du)
            totalEpisodes.episodes[i].Embed = dataServer.EMBED?.link || null;
            if (totalEpisodes.episodes[i].Embed)
                totalEpisodes.episodes[i].Embed = getIdFromUrl(totalEpisodes.episodes[i].Embed)
            currentEpisodes.push(totalEpisodes.episodes[i]);
            await delay(500)
        }
        await saveEpisodeToDB(anilistId, currentEpisodes)
        if (currentEpisodes.length === 0) continue;
        if (totalEpisodes.status.includes("Trọn bộ") ||totalEpisodes.status.includes("Full") )
            await saveProviderStatus(anilistId, "Completed")
        //  if (totalEpisodes.status == "Full" || totalEpisodes.status ==  "Trọn bộ FHD VietSub" || totalEpisodes.status == "Trọn bộ HD VietSub" || totalEpisodes.status == "Tập Full" || totalEpisodes.status == "Trọn bộ BD VietSub" || totalEpisodes.status == "Trọn bộ BD/Bluray VietSub" ) {
        //     await saveProviderStatus(anilistId, "Completed")
        // }
        else
            await saveProviderStatus(anilistId, "Ongoing")

        console.log("Da luu thanh cong")
        await delay(500)
    }

}

const handleAsync = async (config) => {
    try {
        await ConnectModel(config)
        console.log('Starting episode extraction...\n');
        const response = await axios.get("https://raw.githubusercontent.com/animevsubtv/data-animevsub-ext/master/transform.json");
        const data = response.data;
        const animevietsuburl = `${data.scheme}://${data.host}`
        console.log(animevietsuburl)
        await run(animevietsuburl);

    } catch (e) {
        console.error('Failed:', e);
        process.exit(1);
    }
}
export default handleAsync
