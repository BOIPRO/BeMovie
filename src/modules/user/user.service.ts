import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";

@Injectable()
export class UserService {
constructor(private userRepository: UserRepository) {}
  async getUserInfo(userId: string) {
    const data = await this.userRepository.getListFavoriteAnimesByUserId(userId);
    const favoriteAnimes = data[0]?.favoriteAnimesDetails || { favoriteAnimesDetails: [] }
    const userProfile = await this.userRepository.getUserById(userId);
    return { userProfile: userProfile[0], favoriteAnimes };
  }
}