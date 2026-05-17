import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,InferSchemaType } from 'mongoose';
@Schema({ _id: false }) 
class NextAiringEpisode {
  @Prop({ type: Number })
  episode!: number;
}

const NextAiringEpisodeSchema = SchemaFactory.createForClass(NextAiringEpisode);
@Schema({ timestamps: true }) 
export class Movie extends Document {
  @Prop({ required: true, unique: true })
  anilistId!: number;
   @Prop({ required: true})
  idMal!: number;
  @Prop({ required: true, index: true })
  titleRomaji!: string;
  @Prop({unique : true, index : true})
  slug! : string;
  @Prop()
  titleEnglish!: string;
  @Prop()
  coverImage!: string;
  @Prop({ index: true }) 
  genres!: string[];
  @Prop({ index: true }) 
  averageScore!: number;
  @Prop({ index: true })
  popularity!: number;
  @Prop({ index: true })
  trending!: number;
  @Prop()
  description!: string;
  @Prop({index : true})
  status!: string;
  @Prop({ index: true }) // CronJob
  anilistUpdatedAt!: number;
  @Prop()
  isAdult! : boolean;
  @Prop({default : false ,index : true})
  isPublished! : boolean;
  @Prop({index : true})
  lastChecked!: Date;
  @Prop({index : true,required : false})
  checkAttempts! :number
  @Prop()
  episodes! : number
  @Prop({index : true})
  isComplete! : boolean;
  @Prop({ type: NextAiringEpisodeSchema })
  nextAiringEpisode! : NextAiringEpisode
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.index({ titleRomaji: 'text', titleEnglish: 'text' });
export type Movies = InferSchemaType<typeof MovieSchema>;