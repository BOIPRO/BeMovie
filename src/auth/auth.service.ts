import { BadRequestException, ConflictException, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RESEND_CLIENT } from 'src/common/resend.provider';
import { Resend } from 'resend';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @Inject(RESEND_CLIENT) private readonly resend: Resend
    ) { }
    private async sendVerificationEmail(to: string, code: string) {
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
                    verifyOTP: otpHash,
                    expireOTP: new Date(Date.now() + 3 * 60 * 1000),
                    password: hashPassword,
                }
            },
            { upsert: true }
        )
        await this.sendVerificationEmail(email, otp)
    }
    private async checkUsernameUnique(username: string) {
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
        const user = await this.userModel.findOne({ email: email }).select('verifyOTP expireOTP')
        if (user) {
            if (new Date() > user.expireOTP) {
                throw new BadRequestException("Ma xac thuc da het han vui long gui lai")
            }
            const check = crypto.createHash('sha256').update(otp).digest('hex') === user.verifyOTP;
            if (check) {
                await this.userModel.updateOne(
                    { email: email },
                    {
                        $set: {
                            isVerify: true
                        },
                        $unset:{
                            expireAt : ""
                        }
                    },
                )
            }
            else
                throw new BadRequestException("Ma OTP khong chinh xac")
        }
        else {
            // Khong tim thay email
            throw new UnauthorizedException('Ma xac thuc khong dung')
        }
    }
}
