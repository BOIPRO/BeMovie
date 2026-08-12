import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";

@Injectable()
export class UserService {
constructor(private userRepository: UserRepository) {}
  async getUserInfo(userId: string) {
    const favoriteAnimes = await this.userRepository.getListFavoriteAnimesByUserId(userId);
    const userProfile = await this.userRepository.getUserById(userId);
    return { userProfile: userProfile[0], favoriteAnimes };
  }
}