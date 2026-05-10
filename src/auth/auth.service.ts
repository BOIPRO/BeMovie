import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) { }
    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
    private createOTP(): string {
        const otp = crypto.randomInt(100000, 999999).toString();
        return otp;
    }
    private async getUserByEmail(email: string): Promise<User | null> {
        const result = await this.userModel.findOne({ email: email }).select("username isVerify").exec()
        return result
    }
    private async updateUserToDB(email: string, username: string, password: string): Promise<string> {
        const otp = this.createOTP();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const hashPassword = this.hashPassword(password)
        await this.userModel.updateOne(
            { email: email },
            {
                $set: {
                    username: username,
                    verifyOTP: otpHash,
                    expireOTP: new Date(),
                    password: hashPassword,
                }
            },
            { upsert: true }
        )
        return otp
    }
    private async checkUsernameUnique(username: string) {
        const exists = await this.userModel.findOne({ username }).exec();
        if (exists) throw new ConflictException("Username nay da ton tai");
    }
    async validateEmailForRegistration(email: string, username: string, password: string): Promise<string> {
        const user = await this.getUserByEmail(email)
        if (user) {
            if (user.isVerify)
                throw new ConflictException("Email da ton tai")
            if (user.username === username) {
                return await this.updateUserToDB(email, username, password)
            }
            else {
                await this.checkUsernameUnique(username)
                return await this.updateUserToDB(email, username, password)
            }
        }
        else
            return await this.updateUserToDB(email, username, password)
    }


}
