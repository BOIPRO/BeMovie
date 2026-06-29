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
exports.GetStreamQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum["ANIMEVIETSUB"] = "animevietsub";
})(ProviderEnum || (ProviderEnum = {}));
var ServerEnum;
(function (ServerEnum) {
    ServerEnum["HDX"] = "EMBED";
    ServerEnum["DU"] = "DU";
})(ServerEnum || (ServerEnum = {}));
class GetStreamQueryDto {
    anilistId;
    episodeSlug;
    provider;
    server;
}
exports.GetStreamQueryDto = GetStreamQueryDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'anilistId không được để trống' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)({}, { message: 'anilistId phải là một số hợp lệ' }),
    __metadata("design:type", Number)
], GetStreamQueryDto.prototype, "anilistId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'episodeSlug không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'episodeSlug phải là một chuỗi ký tự' }),
    __metadata("design:type", String)
], GetStreamQueryDto.prototype, "episodeSlug", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider không được để trống' }),
    (0, class_validator_1.IsEnum)(ProviderEnum, {
        message: 'Provider bắt buộc phải là ANIMEVIETSUB'
    }),
    __metadata("design:type", String)
], GetStreamQueryDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ServerEnum, {
        message: 'Server chỉ có thể là HDX hoặc DU'
    }),
    __metadata("design:type", String)
], GetStreamQueryDto.prototype, "server", void 0);
//# sourceMappingURL=get-stream-dto.js.map