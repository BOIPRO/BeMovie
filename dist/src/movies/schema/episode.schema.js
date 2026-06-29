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
exports.EpisodeSchema = exports.Episode = exports.SourceSchema = exports.Source = exports.ServerSchema = exports.Server = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Server = class Server {
    name;
    url;
};
exports.Server = Server;
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Server.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Server.prototype, "url", void 0);
exports.Server = Server = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Server);
exports.ServerSchema = mongoose_1.SchemaFactory.createForClass(Server);
let Source = class Source {
    provider;
    episodeId;
    servers;
};
exports.Source = Source;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Source.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Source.prototype, "episodeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ServerSchema], default: [] }),
    __metadata("design:type", Array)
], Source.prototype, "servers", void 0);
exports.Source = Source = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Source);
exports.SourceSchema = mongoose_1.SchemaFactory.createForClass(Source);
let Episode = class Episode {
    anilistId;
    episodeNumber;
    sources;
    episodeSlug;
};
exports.Episode = Episode;
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, index: true }),
    __metadata("design:type", Number)
], Episode.prototype, "anilistId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Episode.prototype, "episodeNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.SourceSchema] }),
    __metadata("design:type", Array)
], Episode.prototype, "sources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], Episode.prototype, "episodeSlug", void 0);
exports.Episode = Episode = __decorate([
    (0, mongoose_1.Schema)({
        strict: false
    })
], Episode);
exports.EpisodeSchema = mongoose_1.SchemaFactory.createForClass(Episode);
//# sourceMappingURL=episode.schema.js.map