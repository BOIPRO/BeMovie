import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Resend } from 'resend';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from "../common/redis/redis.service";
export declare class AuthService {
    private userModel;
    private readonly resend;
    private jwtService;
    private readonly redisService;
    constructor(userModel: Model<User>, resend: Resend, jwtService: JwtService, redisService: RedisService);
    private sendVerificationEmail;
    private hashPassword;
    private createOTP;
    private getUserByEmail;
    private updateUserToDB;
    private checkUsernameUnique;
    validateEmailForRegistration(email: string, username: string, password: string): Promise<void>;
    VerifyEmail(email: string, otp: string): Promise<void>;
    resendCode(email: string): Promise<void>;
    login(username: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
}
