import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user.schema";
import { Model } from "mongoose";
import { Types } from 'mongoose';
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
    async getMeById(id: string) {
        const userInfo = await this.userModel.find({ _id: id }).select("username avatar").exec()
        return userInfo
    }
    async getUserById(id: string) {
        const userInfo = await this.userModel.find({ _id: id }).select("username avatar").exec()
        return userInfo
    }
    async getListFavoriteAnimesByUserId(id: string) {
    const listAnimeInfo = await this.userModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
            $project: {
                top4Favorites: { $slice: ["$favoriteAnimes", 4] }
            }
        },
        {
            $lookup: {
                from: "animes",
                localField: "top4Favorites",
                foreignField: "anilistId",
                as: "rawAnimesDetails" 
            }
        },
        {
            $project: {
                _id: 0,
                favoriteAnimesDetails: {
                    $map: {
                        input: "$top4Favorites",
                        as: "favId",
                        in: {
                            $let: {
                                vars: {
                                    matchedAnime: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$rawAnimesDetails",
                                                    as: "a",
                                                    cond: { $eq: ["$$a.anilistId", "$$favId"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: {
                                    anilistId: "$$matchedAnime.anilistId",
                                    coverImage: "$$matchedAnime.anilistData.coverImage.large",
                                    slug: "$$matchedAnime.slug",
                                    currentEpisode: "$$matchedAnime.currentEpisode",
                                    title: {
                                        $let: {
                                            vars: {
                                                target: {
                                                    $filter: {
                                                        input: "$$matchedAnime.mappings",
                                                        as: "m",
                                                        cond: { $eq: ["$$m.provider", "animevietsub"] }
                                                    }
                                                }
                                            },
                                            in: { $arrayElemAt: ["$$target.title", 0] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    ]);
    
    return listAnimeInfo[0]?.favoriteAnimesDetails || { favoriteAnimesDetails: [] };
}
    async createUser(username: string, hashPassword: string): Promise<void> {
        await this.userModel.updateOne(
            { username: username },
            {
                $set: {
                    password: hashPassword,
                }
            },
            { upsert: true }
        )
    }
    async updateVerifyUser(email: string) {
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