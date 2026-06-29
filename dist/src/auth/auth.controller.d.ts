import { AuthService } from './auth.service';
import { CreateUserDto } from "../common/dto/user.dto";
import { VerifyEmail } from "../common/dto/verify.dto";
import { ResendDto } from "../common/dto/resend.dto";
import { LoginDto } from "../common/dto/login.dto";
import { type Response, type Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerUser(createUserDto: CreateUserDto): Promise<globalThis.Response>;
    verifyEmail(verifyemailDto: VerifyEmail): Promise<globalThis.Response>;
    resendCode(resendDto: ResendDto): Promise<globalThis.Response>;
    login(loginDto: LoginDto, response: Response): Promise<void>;
    refresh(request: Request, response: Response): Promise<void>;
    logout(response: Response): Promise<void>;
}
