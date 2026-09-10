import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/common/guard/JwtAuthGuard";
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('profile')
    getProfile(@Req() req: Request) {
        const user = (req as any).user;
        return this.userService.getUserInfo(user.id)
    }
}