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
    expireAt!: Date

}
export const UserSchema = SchemaFactory.createForClass(User);