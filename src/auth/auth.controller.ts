import { Body, Controller, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { VerifyEmail } from 'src/common/dto/verify.dto';
import { ResendDto } from 'src/common/dto/resend.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { type Response, type Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        await this.authService.validateEmailForRegistration(createUserDto.email, createUserDto.username, createUserDto.password)
        return new Response(
            JSON.stringify({ message: 'ok' }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
    @Post('verify')
    async verifyEmail(@Body() verifyemailDto: VerifyEmail) {
        await this.authService.VerifyEmail(verifyemailDto.email, verifyemailDto.otp)
        return new Response(
            JSON.stringify({ message: 'ok' }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
    @Post('resend')
    async resendCode(@Body() resendDto: ResendDto) {
        await this.authService.resendCode(resendDto.email)
        return new Response(
            JSON.stringify({ message: 'ok' }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(loginDto.username, loginDto.password);
        response.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.cookie('accessToken', result.accessToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000 
        });
    }
    @Post('refresh')
    async refresh(@Req() request: Request,@Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException('Khong tm thay nguoi dung');
        }
        const result = await this.authService.refreshAccessToken(refreshToken);
        response.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000
        });
    }
    @Post('logout')
    async logout(@Res({passthrough : true}) response: Response) {
        await this.authService.logout(response.req.cookies['refreshToken']);
        response.clearCookie('refreshToken', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        response.clearCookie('accessToken',{
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
    }

}
