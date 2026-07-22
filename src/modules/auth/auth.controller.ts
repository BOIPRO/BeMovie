import { Body, Controller, Post, UseGuards, Res, Req, UnauthorizedException,Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/auth/dto/user.dto';
import { VerifyEmail } from 'src/modules/auth/dto/verify.dto';
import { ResendDto } from 'src/modules/auth/dto/resend.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { type Response, type Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/JwtAuthGuard';
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
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req : Request) {
        const user = (req as any).user;
        const userInfo= await this.authService.getProfile(user.id)
        console.log(userInfo[0])
        return userInfo[0]
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
       return {
        user : result.user,
        accessToken : result.accessToken
       }
    }
    @Post('refresh')
    async refresh(@Req() request: Request,@Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException('Khong tm thay nguoi dung');
        }
        const result = await this.authService.refreshAccessToken(refreshToken);
          return {
        accessToken : result.accessToken
       }
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
    }

}
