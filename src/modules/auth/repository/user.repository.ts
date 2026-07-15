import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) { }
    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email: email }).select("username isVerify").exec()
        return user
    }
     async getUserByUsername(username: string) {
        const user = await this.userModel.findOne({ username: username }).select("username password isVerify email").exec()
        return user
    }
    async getUserById(id : string) {
         const userInfo = await this.userModel.find({ _id: id }).select("username email").exec()
        return userInfo
    }
    async checkUsernameUnique(username: string): Promise<void> {
        const exists = await this.userModel.findOne({ username }).exec();
        if (exists) throw new ConflictException("Tên đăng nhập đã tồn tại");
    }
    async addUser(email: string, username: string, hashPassword: string): Promise<void> {
            await this.userModel.updateOne(
                { email: email },
                {
                    $set: {
                        username: username,
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