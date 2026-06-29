"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const resend_provider_1 = require("../common/resend.provider");
const resend_1 = require("resend");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../common/redis/redis.service");
let AuthService = class AuthService {
    userModel;
    resend;
    jwtService;
    redisService;
    constructor(userModel, resend, jwtService, redisService) {
        this.userModel = userModel;
        this.resend = resend;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async sendVerificationEmail(to, code) {
        try {
            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: [to],
                subject: 'Xác nhận tài khoản của bạn',
                html: `<strong>Mã xác nhận của bạn là: ${code}</strong>`,
            });
        }
        catch (error) {
            throw new Error('Không thể gửi email');
        }
    }
    async hashPassword(password) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
    createOTP() {
        const otp = crypto.randomInt(100000, 999999).toString();
        return otp;
    }
    async getUserByEmail(email) {
        const user = await this.userModel.findOne({ email: email }).select("username isVerify").exec();
        return user;
    }
    async updateUserToDB(email, username, password) {
        const otp = this.createOTP();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const hashPassword = await this.hashPassword(password);
        await this.userModel.updateOne({ email: email }, {
            $set: {
                username: username,
                password: hashPassword,
            }
        }, { upsert: true });
        await this.redisService.set(`otp:${email}`, JSON.stringify({ otpHash }), 3 * 60);
        await this.sendVerificationEmail(email, otp);
    }
    async checkUsernameUnique(username) {
        const exists = await this.userModel.findOne({ username }).exec();
        if (exists)
            throw new common_1.ConflictException("Username nay da ton tai");
    }
    async validateEmailForRegistration(email, username, password) {
        const user = await this.getUserByEmail(email);
        if (user) {
            if (user.isVerify)
                throw new common_1.ConflictException("Email da ton tai");
            if (user.username === username) {
                await this.updateUserToDB(email, username, password);
            }
            else {
                await this.checkUsernameUnique(username);
                await this.updateUserToDB(email, username, password);
            }
        }
        else
            await this.updateUserToDB(email, username, password);
    }
    async VerifyEmail(email, otp) {
        const { otpHash } = await this.redisService.get(`otp:${email}`);
        if (!otpHash) {
            throw new common_1.BadRequestException("Ma xac thuc khong dung");
        }
        const check = crypto.createHash('sha256').update(otp).digest('hex') === otpHash;
        if (check) {
            await this.userModel.updateOne({ email: email }, {
                $set: {
                    isVerify: true
                },
                $unset: {
                    expireAt: ""
                }
            });
        }
        else
            throw new common_1.BadRequestException("Ma OTP khong chinh xac");
    }
    async resendCode(email) {
        const user = await this.userModel.findOne({ email: email });
        if (user) {
            const otp = this.createOTP();
            const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
            await this.redisService.set(`otp:${email}`, JSON.stringify({ otpHash }), 3 * 60);
            await this.sendVerificationEmail(email, otp);
        }
        else {
            throw new common_1.BadRequestException("Co loi xay ra");
        }
    }
    async login(username, password) {
        const user = await this.userModel.findOne({ username }).select('username password isVerify').exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Username hoac mat khau khong dung');
        }
        if (!user.isVerify) {
            throw new common_1.UnauthorizedException('Tai khoan chua xac thuc email');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Username hoac mat khau khong dung');
        }
        const accessToken = this.jwtService.sign({ id: user._id, username: user.username }, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ id: user._id, username: user.username }, { expiresIn: '7d' });
        const refreshTokenExpireAt = 7 * 24 * 60 * 60;
        await this.redisService.set(`refreshToken:${user._id}`, JSON.stringify({ refreshToken }), refreshTokenExpireAt);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.redisService.get(`refreshToken:${decoded.id}`);
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Refresh token khong hop le');
            }
            const accessToken = this.jwtService.sign({ id: user._id, username: user.username }, { expiresIn: '15m' });
            return { accessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token khong hop le');
        }
    }
    async logout(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            await this.redisService.del(`refreshToken:${decoded.id}`);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token khong hop le');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, common_1.Inject)(resend_provider_1.RESEND_CLIENT)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        resend_1.Resend,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map