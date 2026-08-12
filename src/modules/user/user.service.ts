import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";

@Injectable()
export class UserService {
constructor(private userRepository: UserRepository) {}
  async getUserInfo(userId: string) {
    return this.userRepository.getUserById(userId);
  }
}