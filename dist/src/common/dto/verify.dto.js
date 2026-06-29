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
exports.VerifyEmail = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class VerifyEmail {
    email;
    otp;
}
exports.VerifyEmail = VerifyEmail;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsEmail)({}, { message: "Email không dúng định dạng." }),
    __metadata("design:type", String)
], VerifyEmail.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã OTP không được để trống' }),
    (0, class_validator_1.Length)(6, 6, { message: 'Mã OTP phải có đúng 6 ký tự' }),
    (0, class_validator_1.Matches)(/^[0-9]+$/, {
        message: 'Mã OTP chỉ được chứa các chữ số, không bao gồm chữ cái hoặc ký tự đặc biệt'
    }),
    __metadata("design:type", String)
], VerifyEmail.prototype, "otp", void 0);
//# sourceMappingURL=verify.dto.js.map