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
exports.MovieSchema = exports.Movie = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NextAiringEpisode = class NextAiringEpisode {
    episode;
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], NextAiringEpisode.prototype, "episode", void 0);
NextAiringEpisode = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NextAiringEpisode);
const NextAiringEpisodeSchema = mongoose_1.SchemaFactory.createForClass(NextAiringEpisode);
let Movie = class Movie extends mongoose_2.Document {
    anilistId;
    idMal;
    titleRomaji;
    slug;
    titleEnglish;
    coverImage;
    genres;
    averageScore;
    popularity;
    trending;
    description;
    status;
    anilistUpdatedAt;
    isAdult;
    isPublished;
    lastChecked;
    checkAttempts;
    episodes;
    isComplete;
    nextAiringEpisode;
};
exports.Movie = Movie;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", Number)
], Movie.prototype, "anilistId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Movie.prototype, "idMal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Movie.prototype, "titleRomaji", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, index: true }),
    __metadata("design:type", String)
], Movie.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Movie.prototype, "titleEnglish", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Movie.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Number)
], Movie.prototype, "averageScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Number)
], Movie.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Number)
], Movie.prototype, "trending", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Movie.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Movie.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Number)
], Movie.prototype, "anilistUpdatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Movie.prototype, "isAdult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Movie.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Date)
], Movie.prototype, "lastChecked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true, required: false }),
    __metadata("design:type", Number)
], Movie.prototype, "checkAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Movie.prototype, "episodes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Boolean)
], Movie.prototype, "isComplete", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NextAiringEpisodeSchema }),
    __metadata("design:type", NextAiringEpisode)
], Movie.prototype, "nextAiringEpisode", void 0);
exports.Movie = Movie = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Movie);
exports.MovieSchema = mongoose_1.SchemaFactory.createForClass(Movie);
exports.MovieSchema.index({ titleRomaji: 'text', titleEnglish: 'text' });
//# sourceMappingURL=movie.schema.js.map