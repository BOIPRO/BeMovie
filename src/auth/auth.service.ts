import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RESEND_CLIENT } from 'src/common/resend.provider';
import { Resend } from 'resend';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @Inject(RESEND_CLIENT) private readonly resend: Resend,
        private jwtService: JwtService,
        private readonly redisService: RedisService
    ) { }
    private async sendVerificationEmail(to: string, code: string): Promise<void> {
        try {
            await this.resend.emails.send({
                from: 'onboarding@resend.dev', // Domain đã verify trên Resend
                to: [to],
                subject: 'Xác nhận tài khoản của bạn',
                html: `<strong>Mã xác nhận của bạn là: ${code}</strong>`,
            });
        } catch (error) {
            throw new Error('Không thể gửi email');
        }
    }
    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
    private createOTP(): string {
        const otp = crypto.randomInt(100000, 999999).toString();
        return otp;
    }
    private async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email: email }).select("username isVerify").exec()
        return user
    }
    private async updateUserToDB(email: string, username: string, password: string): Promise<void> {
        const otp = this.createOTP();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const hashPassword = await this.hashPassword(password)
        await this.userModel.updateOne(
            { email: email },
            {
                $set: {
                    username: username,
                    password: hashPassword,
                }
            },
            { upsert: true }
        )
        await this.redisService.set(`otp:${email}`, JSON.stringify({ otpHash }), 3 * 60)
        await this.sendVerificationEmail(email, otp)
    }
    private async checkUsernameUnique(username: string): Promise<void> {
        const exists = await this.userModel.findOne({ username }).exec();
        if (exists) throw new ConflictException("Username nay da ton tai");
    }
    async validateEmailForRegistration(email: string, username: string, password: string): Promise<void> {
        const user = await this.getUserByEmail(email)
        if (user) {
            if (user.isVerify)
                throw new ConflictException("Email da ton tai")
            if (user.username === username) {
                await this.updateUserToDB(email, username, password)
            }
            else {
                await this.checkUsernameUnique(username)
                await this.updateUserToDB(email, username, password)
            }
        }
        else
            await this.updateUserToDB(email, username, password)
    }
    async VerifyEmail(email: string, otp: string): Promise<void> {
        const {otpHash} = await this.redisService.get(`otp:${email}`)
        if (!otpHash) {
            throw new BadRequestException("Ma xac thuc khong dung")
        }
        const check = crypto.createHash('sha256').update(otp).digest('hex') === otpHash;
        if (check) {
            await this.userModel.updateOne(
                { email: email },
                {
                    $set: {
                        isVerify: true
                    },
                    $unset: {
                        expireAt: ""
                    }
                },
            )
        }
        else
            throw new BadRequestException("Ma OTP khong chinh xac")
}

    async resendCode(email: string) : Promise < void> {
    const user = await this.userModel.findOne({ email: email })
        if(user) {
        const otp = this.createOTP();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        await this.redisService.set(`otp:${email}`, JSON.stringify({ otpHash }), 3 * 60)
        await this.sendVerificationEmail(email, otp)
    }
        else {
        throw new BadRequestException("Co loi xay ra")
    }
}
    async login(username: string, password: string): Promise < { accessToken: string; refreshToken: string } > {
    const user = await this.userModel.findOne({ username }).select('password isVerify').exec();
    if(!user) {
        throw new UnauthorizedException('Username hoac mat khau khong dung');
    }
        if(!user.isVerify) {
    throw new UnauthorizedException('Tai khoan chua xac thuc email');
}
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
    throw new UnauthorizedException('Username hoac mat khau khong dung');
}
const accessToken = this.jwtService.sign(
    { id: user._id, username: user.username },
    { expiresIn: '15m' }
);
const refreshToken = this.jwtService.sign(
    { id: user._id, username: user.username },
    { expiresIn: '7d' }
);
const refreshTokenExpireAt = 7 * 24 * 60 * 60
await this.redisService.set(`refreshToken:${user._id}`, JSON.stringify({ refreshToken }), refreshTokenExpireAt);
return {
    accessToken,
    refreshToken
};
    }
    async refreshAccessToken(refreshToken: string): Promise < { accessToken: string } > {
    try {
        const decoded = this.jwtService.verify(refreshToken);
        const user = await this.redisService.get(`refreshToken:${decoded.id}`);
        if(!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedException('Refresh token khong hop le');
}
const accessToken = this.jwtService.sign(
    { id: user._id, username: user.username },
    { expiresIn: '15m' }
);
return { accessToken };
        } catch (error) {
    throw new UnauthorizedException('Refresh token khong hop le');
}
    }
    async logout(userId: string): Promise < void> {
    await this.userModel.updateOne(
        { _id: userId },
        {
            $unset: {
                refreshToken: "",
                refreshTokenExpireAt: "",
            }
        }
    );
}
}
