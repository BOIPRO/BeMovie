import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { UserRepository } from '../user/repository/user.repository';
@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private readonly redisService: RedisService
    ) { }
    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
    // private createOTP(): string {
    //     const otp = crypto.randomInt(100000, 999999).toString();
    //     return otp;
    // }
    async validateUserForRegistration(username: string, password: string): Promise<void> {
        const user = await this.userRepository.getUserByUsername(username)
        if (user) {
            throw new ConflictException("Tên đăng nhập đã tồn tại")
        }
        else {
            const hashPassword = await this.hashPassword(password)
            await this.userRepository.createUser(username, hashPassword)
        }
    }
    // async VerifyEmail(email: string, otp: string): Promise<void> {
    //     const { otpHash } = await this.redisService.get(`otp:${email}`)
    //     if (!otpHash) {
    //         throw new BadRequestException("Mã xác thực không đúng")
    //     }
    //     const check = crypto.createHash('sha256').update(otp).digest('hex') === otpHash;
    //     if (check) {
    //         await this.userRepository.updateVerifyUser(email)
    //     }
    //     else
    //         throw new BadRequestException("Mã xác thực không đúng")
    // }

    // async resendCode(email: string): Promise<void> {
    //     const user = await this.userRepository.getUserByEmail(email)
    //     if (user) {
    //         const otp = this.createOTP();
    //         const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    //         await this.redisService.set(`otp:${email}`, JSON.stringify({ otpHash }), 3 * 60)
    //         await this.sendVerificationEmail(email, otp)
    //     }
    //     else {
    //         throw new BadRequestException("Co loi xay ra")
    //     }
    // }
    async login(username: string, password: string): Promise<{ user: object; accessToken: string, refreshToken: string }> {
        const user = await this.userRepository.getUserByUsername(username)
        if (!user ) {
            throw new UnauthorizedException('Tên người dùng hoặc mật khẩu không đúng');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Tên người dùng hoặc mật khẩu không đúng');
        }
        const accessToken = this.jwtService.sign(
            { id: user._id, username: user.username },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m'
            }
        );
        const refreshToken = this.jwtService.sign(
            { id: user._id, username: user.username },

            {
                secret: process.env.JWT_SECRET,
                expiresIn: '7d'
            }
        );
        const refreshTokenExpireAt = 7 * 24 * 60 * 60
        await this.redisService.set(`refreshToken:${user._id}`, JSON.stringify({ refreshToken }), refreshTokenExpireAt);
        return {
            user: {
                id: user._id,
                username: user.username,
                avatar : user.avatar
            },
            accessToken,
            refreshToken,
        };
    }
    async getMe(id: string) {
        const userInfo = await this.userRepository.getMeById(id)
        return userInfo
    }
    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const accessToken = this.jwtService.sign(
                { id: decoded.id, username: decoded.username },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '15m'
                }
            );
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Refresh token khong hop le');
        }
    }
    async logout(refreshToken: string): Promise<void> {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            await this.redisService.del(`refreshToken:${decoded.id}`);
        } catch (error) {
            throw new UnauthorizedException('Refresh token khong hop le');
        }
    }
}
