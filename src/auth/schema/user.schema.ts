import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, index: true, unique: true })
    username!: number;
    @Prop({ required: true, index: true, unique: true })
    email!: number;
    @Prop({ required: true })
    password!: string;
    @Prop({ default: false })
    isVerify !: boolean
    @Prop()
    refreshToken !: string;
    @Prop()
    refreshTokenExpireAt!: Date
    @Prop()
    verifyToken!: string
    @Prop({
        expires: 0,
        default: () =>
            new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    expireAt!: Date

}
export const UserSchema = SchemaFactory.createForClass(User);