import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false }) 
export class Relation {
  @Prop()
  relationType!: string; 

  @Prop()
  id!: number; 

  @Prop()
  idMal!: number;

  @Prop({ type: Object })
  title!: {
    romaji: string;
    english: string;
  };

  @Prop()
  format!: string; 

  @Prop()
  status!: string;

  @Prop()
  coverImage!: string; 
}
export const RelationSchema = SchemaFactory.createForClass(Relation);