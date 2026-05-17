import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, index: true, unique: true })
    username!: string;
    @Prop({ required: true, index: true, unique: true})
    email!: string;
    @Prop({ required: true })
    password!: string;
    @Prop({ default: false })
    isVerify !: boolean
    @Prop()
    verifyOTP!: string
    @Prop()
    expireOTP! : Date
    @Prop({
        expires: 0,
        default: () =>
            new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    expireAt!: Date

}
export const UserSchema = SchemaFactory.createForClass(User);