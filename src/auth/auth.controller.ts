import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { VerifyEmail } from 'src/common/dto/verify.dto';

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

}
