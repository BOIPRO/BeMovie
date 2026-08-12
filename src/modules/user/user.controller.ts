import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/common/guard/JwtAuthGuard";
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('profile')
    async getProfile(@Req() req: Request) {
        const user = (req as any).user;
        const userInfo = await this.userService.getUserInfo(user.id)
        console.log(userInfo[0])
        return userInfo[0]
    }
}