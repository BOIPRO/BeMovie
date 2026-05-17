import { Body, Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { VerifyEmail } from 'src/common/dto/verify.dto';
import { ResendDto } from 'src/common/dto/resend.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { type Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
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
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
         return {
            accessToken: result.accessToken
         }
    }
    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        const result = await this.authService.refreshAccessToken(body.refreshToken);
        return result;
    }
    @Post('logout')
    async logout(@Request() req: any) {
        const userId = req.user?.id;
        if (!userId) {
            return new Response(
                JSON.stringify({ message: 'User not authenticated' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        await this.authService.logout(userId);
        return new Response(
            JSON.stringify({ message: 'ok' }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

}
