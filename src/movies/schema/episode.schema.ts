import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true}) 
export class Episode {
    @Prop({required : true , index : true})
    anilistId!: number;
    @Prop()
    episodeNumber! : string;
    @Prop()
    server!: string
    @Prop({ required: true ,index : true})
    episodeId!: string; 
    @Prop({ default: ""})
    url!: string; 
}
export const EpsiodeSchema = SchemaFactory.createForClass(Episode);