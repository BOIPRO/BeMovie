import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, index: true, unique: true })
    username!: string;
    @Prop({ required: true })
    password!: string;
    @Prop({default : "https://res.cloudinary.com/l1b3nqns/image/upload/v1785661100/default_avatar_enepxl.jpg"})
    avatar : string;
    @Prop({ type: [Number], default: [] })
    favoriteAnimes!: number[];
}
export const UserSchema = SchemaFactory.createForClass(User);