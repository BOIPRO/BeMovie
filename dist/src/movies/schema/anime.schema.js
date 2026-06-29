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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeSchema = exports.Anime = exports.ProviderMapping = exports.AnilistDataDetail = exports.TrailerDetail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let TitleDetail = class TitleDetail {
    romaji;
    english;
    native;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TitleDetail.prototype, "romaji", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TitleDetail.prototype, "english", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TitleDetail.prototype, "native", void 0);
TitleDetail = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TitleDetail);
let CoverImageDetail = class CoverImageDetail {
    large;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CoverImageDetail.prototype, "large", void 0);
CoverImageDetail = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CoverImageDetail);
let TrailerDetail = class TrailerDetail {
    id;
    site;
    thumbnail;
};
exports.TrailerDetail = TrailerDetail;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TrailerDetail.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TrailerDetail.prototype, "site", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TrailerDetail.prototype, "thumbnail", void 0);
exports.TrailerDetail = TrailerDetail = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TrailerDetail);
let AnilistDataDetail = class AnilistDataDetail {
    title;
    coverImage;
    episodes;
    seasonYear;
    season;
    status;
    genres;
    description;
    trending;
    popularity;
    averageScore;
    bannerImage;
    trailer;
};
exports.AnilistDataDetail = AnilistDataDetail;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_1.SchemaFactory.createForClass(TitleDetail) }),
    __metadata("design:type", TitleDetail)
], AnilistDataDetail.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_1.SchemaFactory.createForClass(CoverImageDetail) }),
    __metadata("design:type", CoverImageDetail)
], AnilistDataDetail.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AnilistDataDetail.prototype, "episodes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], AnilistDataDetail.prototype, "seasonYear", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnilistDataDetail.prototype, "season", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnilistDataDetail.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], AnilistDataDetail.prototype, "genres", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnilistDataDetail.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], AnilistDataDetail.prototype, "trending", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AnilistDataDetail.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], AnilistDataDetail.prototype, "averageScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnilistDataDetail.prototype, "bannerImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_1.SchemaFactory.createForClass(TrailerDetail), default: null }),
    __metadata("design:type", Object)
], AnilistDataDetail.prototype, "trailer", void 0);
exports.AnilistDataDetail = AnilistDataDetail = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AnilistDataDetail);
let ProviderMapping = class ProviderMapping {
    provider;
    meidaId;
    title;
    sourceUrl;
    subTitle;
    description;
    providerStatus;
    year;
};
exports.ProviderMapping = ProviderMapping;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "meidaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "sourceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "subTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "providerStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProviderMapping.prototype, "year", void 0);
exports.ProviderMapping = ProviderMapping = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProviderMapping);
let Anime = class Anime {
    slug;
    title;
    status;
    anilistId;
    anilistData;
    mappings;
};
exports.Anime = Anime;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Anime.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Anime.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['MAPPED', 'UNMAPPED'],
        default: 'UNMAPPED'
    }),
    __metadata("design:type", String)
], Anime.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null, index: true }),
    __metadata("design:type", Number)
], Anime.prototype, "anilistId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_1.SchemaFactory.createForClass(AnilistDataDetail),
        default: null
    }),
    __metadata("design:type", AnilistDataDetail)
], Anime.prototype, "anilistData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_1.SchemaFactory.createForClass(ProviderMapping)] }),
    __metadata("design:type", Array)
], Anime.prototype, "mappings", void 0);
exports.Anime = Anime = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'animes' })
], Anime);
exports.AnimeSchema = mongoose_1.SchemaFactory.createForClass(Anime);
exports.AnimeSchema.index({ status: 1 });
exports.AnimeSchema.index({ 'mappings.provider': 1, 'mappings.providerId': 1 });
exports.AnimeSchema.index({ 'anilistData.trending': -1 });
//# sourceMappingURL=anime.schema.js.map