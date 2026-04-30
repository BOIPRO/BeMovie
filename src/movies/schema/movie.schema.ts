import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Relation, RelationSchema } from './relation.schema';

@Schema({ timestamps: true }) 
export class Movie extends Document {
  @Prop({ required: true, unique: true })
  anilistId!: number;
   @Prop({ required: true})
  idMal!: number;
  @Prop({ required: true, index: true })
  titleRomaji!: string;

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

  @Prop({ default: 'FINISHED' })
  status!: string;
  @Prop()
  episodes!: number;

  @Prop({ index: true }) // CronJob
  anilistUpdatedAt!: number;
  @Prop()
  isAdult! : boolean;
  @Prop({type : [RelationSchema],default:[]})
  relations!: Relation[];

}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ titleRomaji: 'text', titleEnglish: 'text' });