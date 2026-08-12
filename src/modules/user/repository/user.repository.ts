import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) { }
     async getUserByUsername(username: string) {
        const user = await this.userModel.findOne({ username: username }).select("username password avatar").exec()
        return user
    }
    async getMeById(id : string) {
        const userInfo = await this.userModel.find({ _id: id }).select("username avatar").exec()
        return userInfo
    }
    async getUserById(id : string) {
         const userInfo = await this.userModel.find({ _id: id }).select("username avatar favoriteAnimes").exec()
        return userInfo
    }
    async createUser(username: string, hashPassword: string): Promise<void> {
            await this.userModel.updateOne(
                {username: username},
                {
                    $set: {
                        password: hashPassword,
                    }
                },
                { upsert: true }
            )
        }
    async updateVerifyUser(email : string) {
        await this.userModel.updateOne(
                { email: email },
                {
                    $set: {
                        isVerify: true
                    },
                    $unset: {
                        expireAt: ""
                    }
                },
            )
    }

}