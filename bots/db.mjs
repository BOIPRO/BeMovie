import mongoose, { Schema } from 'mongoose';
const AnilistDataDetailSchema = new Schema({
  title: {
    romaji: String,
    english: String,
    native: String
  },
  coverImage: {
    large: String
  },
  episodes: { type: Number, default: 0 },
  seasonYear: Number,
  season: String,
  status: String,
  genres: [String], // Mảng các chuỗi (Thể loại phim)
  description: String,
  trending: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 }
}, { _id: false });
const ProviderMappingSchema = new Schema({
  provider: { type: String, required: true },   
  meidaId: { type: String, required: true },  
  title: String,
  sourceUrl : { type: String, required: true },
  subTitle: String,
  description: String,
  providerStatus : {type : String, default : null},
  year: String
}, { _id: false }); // Không cần tự sinh trường _id cho từng nguồn lẻ này
const AnimeSchema = new Schema({
  slug: { type: String, required: true, unique: true }, // URL chuẩn SEO
  title: { type: String, required: true },              // Tên dùng chung hiển thị trên Web
  status: { type: String, required: true, enum: ['MAPPED', 'UNMAPPED'], default: 'UNMAPPED' },
  anilistId: { type: Number, default: null, index: true },
  anilistData: {
    type: AnilistDataDetailSchema,
    default: null
  },
  mappings: [ProviderMappingSchema]
}, {
  timestamps: true // Tự động tạo trường createdAt và updatedAt
});
AnimeSchema.index({ status: 1 });
AnimeSchema.index({ 'mappings.provider': 1, 'mappings.providerId': 1 });
AnimeSchema.index({ 'anilistData.trending': -1 });
const serverSchema = new Schema({
  name: { type: String, default: null },
  url: { type: String, default: null }
}, { _id: false });
const source = new Schema({
  provider: String,
  episodeId: Number,
  servers:{
    type: [serverSchema],
    default: [{}]
  },
}, { _id: false }); 

const episodeSchema = new Schema({
  anilistId: { type: Number, required: true, index: true },
  episodeNumber: { type: String },
  sources : [source],
  episodeSlug: { type: String, required: true, index: true }
})
export const ConnectModel = async (config) => {
  await mongoose.connect(`mongodb+srv://boiDev:Boi3112007100@cluster0.ko9cetb.mongodb.net/bmovie`)
}
export const Episodes = mongoose.model('episodes', episodeSchema)
export const Animes = mongoose.model('animes', AnimeSchema)