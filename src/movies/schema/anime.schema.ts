import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnimeDocument = HydratedDocument<Anime>;

// --- 1. Sub-Schema: Title ---
@Schema({ _id: false })
class TitleDetail {
  @Prop({ type: String })
  romaji!: string;

  @Prop({ type: String })
  english!: string;

  @Prop({ type: String })
  native!: string;
}

// --- 2. Sub-Schema: CoverImage ---
@Schema({ _id: false })
class CoverImageDetail {
  @Prop({ type: String })
  large!: string;
}
@Schema({ _id: false })
export class TrailerDetail {
  @Prop({ type: String })
  id!: string;

  @Prop({ type: String })
  site!: string;

  @Prop({ type: String })
  thumbnail!: string;
}
// --- 3. Sub-Schema: AnilistDataDetail ---
@Schema({ _id: false })
export class AnilistDataDetail {
  @Prop({ type: SchemaFactory.createForClass(TitleDetail) })
  title!: TitleDetail;

  @Prop({ type: SchemaFactory.createForClass(CoverImageDetail) })
  coverImage!: CoverImageDetail;

  @Prop({ type: Number, default: 0 })
  episodes!: number;

  @Prop({ type: Number })
  seasonYear!: number;

  @Prop({ type: String })
  season!: string;

  @Prop({ type: String })
  status!: string;

  @Prop({ type: [String] }) // Mảng các chuỗi thể loại
  genres!: string[];

  @Prop({ type: String })
  description!: string;

  @Prop({ type: Number, index: true,default: 0 },)
  trending!: number;

  @Prop({ type: Number, default: 0 })
  popularity!: number;
  @Prop({ type: Number})
  averageScore! : number
   @Prop({ type: String})
  bannerImage! : string
  @Prop({ type: SchemaFactory.createForClass(TrailerDetail), default: null })
  trailer!: TrailerDetail | null;
}

// --- 4. Sub-Schema: ProviderMapping ---
@Schema({ _id: false })
export class ProviderMapping {
  @Prop({ type: String, required: true })
  provider!: string;

  @Prop({ type: String, required: true })
  meidaId!: string; // Giữ nguyên chính tả meidaId từ schema gốc của bạn

  @Prop({ type: String })
  title!: string;

  @Prop({ type: String, required: true })
  sourceUrl!: string;

  @Prop({ type: String })
  subTitle!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: String, default: null })
  providerStatus!: string;

  @Prop({ type: String })
  year!: string;

}

// --- 5. Main Schema: Anime ---
@Schema({ timestamps: true, collection: 'animes' })
export class Anime {
  @Prop({ type: String, required: true, unique: true })
  slug!: string;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ 
    type: String, 
    required: true, 
    enum: ['MAPPED', 'UNMAPPED'], 
    default: 'UNMAPPED' 
  })
  status!: string;

  @Prop({ type: Number, default: null, index: true })
  anilistId!: number;

  @Prop({ 
    type: SchemaFactory.createForClass(AnilistDataDetail), 
    default: null 
  })
  anilistData!: AnilistDataDetail;

  @Prop({ type: [SchemaFactory.createForClass(ProviderMapping)] })
  mappings!: ProviderMapping[];
}

export const AnimeSchema = SchemaFactory.createForClass(Anime);

// Khởi tạo các Hợp Chỉ Mục (Indexes) từ schema gốc của bạn
AnimeSchema.index({ status: 1 });
AnimeSchema.index({ 'mappings.provider': 1, 'mappings.providerId': 1 });
AnimeSchema.index({ 'anilistData.trending': -1 });