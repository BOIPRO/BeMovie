// import { MongoClient } from 'mongodb';
// import slugify from 'slugify';
// import { ConnectModel, Animes } from './db.mjs';
// import fs from 'fs/promises';

// // Hàm tự động tạo slug sạch từ tên phim
// function createSlug(text) {
//     return slugify(text, {
//         lower: true,      // Chuyển về chữ thường
//         strict: true,     // Loại bỏ ký tự đặc biệt (!, @, #,...)
//         locale: 'vi'      // Hỗ trợ tiếng Việt chính xác
//     });
// }

// // HÀM CORE: Biến đổi data thô và lưu vào Database
// // async function processAndSaveAnime(rawItem, Animes) {
// //     const provider = 'animevietsub';
// //     const providerId = rawItem.animevietsub.sourceUrl;

// //     // 1. Kiểm tra xem cặp {provider, providerId} này đã tồn tại trong DB chưa
// //     const existingAnime = await Animes.findOne({
// //         'mappings.provider': provider,
// //         'mappings.providerId': providerId
// //     });

// //     if (existingAnime) {
// //         console.log(`[Bỏ qua] Phim đã tồn tại trong hệ thống: ${rawItem.animevietsub.title}`);
// //         return existingAnime._id; // Trả về ID có sẵn để xử lý tập phim sau này
// //     }

// //     // 2. Phân loại và xử lý cấu trúc dựa trên việc có dữ liệu AniList hay không
// //     const operations = [];
// //     if (rawItem.anilist && rawItem.anilist.id) {
// //         // === TRƯỜNG HỢP 1: CÓ ANILIST (MAPPED) ===
// //         const titleGoc = rawItem.anilist.title.english || rawItem.anilist.title.romaji || rawItem.animevietsub.title;

// //         animeDocument = {
// //             slug: createSlug(titleGoc),
// //             title: titleGoc,
// //             status: 'MAPPED',
// //             anilistId: rawItem.anilist.id,
// //             anilistData: {
// //                 title: rawItem.anilist.title,
// //                 coverImage: rawItem.anilist.coverImage,
// //                 episodes: rawItem.anilist.episodes || 0,
// //                 seasonYear: rawItem.anilist.seasonYear,
// //                 season: rawItem.anilist.season,
// //                 status: rawItem.anilist.status,
// //                 genres: rawItem.anilist.genres || [],
// //                 description: rawItem.anilist.description,
// //                 trending: rawItem.anilist.trending || 0,
// //                 popularity: rawItem.anilist.popularity || 0
// //             },
// //             mappings: [
// //                 {
// //                     provider: provider,
// //                     providerId: providerId,
// //                     title: rawItem.animevietsub.title,
// //                     subTitle: rawItem.animevietsub.subTitle,
// //                     description: rawItem.animevietsub.description,
// //                     year: rawItem.animevietsub.year
// //                 }
// //             ],
// //             createdAt: new Date(),
// //             updatedAt: new Date()
// //         };
// //     } else {
// //         // === TRƯỜNG HỢP 2: KHÔNG CÓ ANILIST HOẶC ANILIST = NULL (UNMAPPED) ===
// //         const titleTho = rawItem.animevietsub.title;

// //         animeDocument = {
// //             slug: createSlug(titleTho),
// //             title: titleTho, // Dùng tạm tên của nguồn cào làm tên hiển thị
// //             status: 'UNMAPPED',
// //             anilistId: null,
// //             anilistData: null, // Để trống hoàn toàn để tiết kiệm bộ nhớ
// //             mappings: [
// //                 {
// //                     sourceUrl : 
// //                     provider: provider,
// //                     providerId: providerId,
// //                     title: rawItem.animevietsub.title,
// //                     subTitle: rawItem.animevietsub.subTitle,
// //                     description: rawItem.animevietsub.description,
// //                     year: rawItem.animevietsub.year
// //                 }
// //             ],
// //             createdAt: new Date(),
// //             updatedAt: new Date()
// //         };
// //     }

// //     // 3. Tiến hành Insert vào bảng animes
// //     const result = await Animes.create(animeDocument);
// //     console.log(`[Thành công] Đã lưu bộ phim mới [${animeDocument.status}]: ${animeDocument.title}`);
// //     return result._id;
// // }

// async function main(Animes) {
//     try {
//         const listDataTho = JSON.parse(await fs.readFile('./anilist_mapping.json', 'utf-8')).series;

//         console.log("Bắt đầu xử lý dữ liệu...");
//         const operations = [];
//         const provider = 'animevietsub';
//         for (const item of listDataTho) {
//             let mediaId;
//            const regex = /-([a-z]?\d+)\/?$/
//             const match = item.animevietsub.sourceUrl.match(regex);
//             if (match) {
//                mediaId  = match[1];
//             } else {
//                 console.warn(`Không trích xuất được providerId từ URL: ${item.animevietsub.sourceUrl}`);
//                 continue; // Bỏ qua item này nếu không có providerId
//             }
//             let animeUpdateData = {};
//             // Phân loại dữ liệu dựa trên việc có AniList hay không
//             if (item.anilist && item.anilist.id) {
//                 const titleGoc = item.anilist.title.english || item.anilist.title.romaji || item.animevietsub.title;

//                 animeUpdateData = {
//                     slug: createSlug(titleGoc),
//                     title: titleGoc,
//                     status: 'MAPPED',
//                     anilistId: item.anilist.id,
//                     anilistData: {
//                         title: item.anilist.title,
//                         coverImage: item.anilist.coverImage,
//                         episodes: item.anilist.episodes || 0,
//                         seasonYear: item.anilist.seasonYear,
//                         season: item.anilist.season,
//                         status: item.anilist.status,
//                         genres: item.anilist.genres || [],
//                         description: item.anilist.description,
//                         trending: item.anilist.trending || 0,
//                         popularity: item.anilist.popularity || 0
//                     }
//                 };
//             } else {
//                 const titleTho = item.animevietsub.title;

//                 animeUpdateData = {
//                     slug: createSlug(titleTho),
//                     title: titleTho,
//                     status: 'UNMAPPED',
//                     anilistId: null,
//                     anilistData: null
//                 };
//             }
//             operations.push({
//                 updateOne: {
//                     filter: {
//                        slug : animeUpdateData.slug,
//                     },
//                     // Dữ liệu sẽ ghi vào Database
//                     update: {
//                         $set: {
//                             ...animeUpdateData,
//                             updatedAt: new Date()
//                         },
//                         $addToSet: {
//                             mappings: {
//                                 provider: provider,
//                                 description : item.animevietsub.description,
//                                 title : item.animevietsub.title,
//                                 subTitle :  item.animevietsub.subtitle,
//                                 meidaId: mediaId,
//                                 sourceUrl : item.animevietsub.sourceUrl,
//                                 year: item.animevietsub.year,
//                             }
//                         }
//                     },
//                     upsert: true 
//                 }
//             });
//         }

//         // 3. Nếu mảng hành động có dữ liệu, kích nổ bulkWrite duy nhất 1 lần!
//         if (operations.length > 0) {
//             console.log(`Đang bắn ${operations.length} data phim lên MongoDB bằng BulkWrite...`);

//             const result = await Animes.bulkWrite(operations, { ordered: false });

//             console.log(`[Bulk Xong] Đã tạo mới xong`);
//             return result;
//         }

//     } catch (error) {
//         console.error("Lỗi trong quá trình xử lý:", error);
//     } finally {
//         console.log("Đã đóng kết nối Database.");
//     }
// }
// const handleAsync = async (config) => {
//     await ConnectModel(config)
//     await main(Animes);
// }
// export default handleAsync
