import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type EpisodeDocument = HydratedDocument<Episode>;

// 1. Định nghĩa Server Schema (_id: false)
@Schema({ _id: false })
export class Server {
  @Prop({ type: String, default: null })
  name!: string;

  @Prop({ type: String, default: null })
  url!: string;
}
export const ServerSchema = SchemaFactory.createForClass(Server);

// 2. Định nghĩa Source Schema (_id: false)
@Schema({ _id: false })
export class Source {
  @Prop({ type: String })
  provider!: string;

  @Prop({ type: Number })
  episodeId!: number;

  // Lồng mảng ServerSchema vào đây, mặc định là một mảng có 1 object rỗng [{}]
    @Prop({ type: [ServerSchema], default: [] })
  servers!: Server[];
}
export const SourceSchema = SchemaFactory.createForClass(Source);

// 3. Định nghĩa Episode Schema chính (Có _id mặc định, có index)
@Schema({ 
  strict: false
})
export class Episode {
  @Prop({ type: Number, required: true,index: true })
  anilistId!: number;

  @Prop({ type: String })
  episodeNumber!: string;

  // Lồng mảng SourceSchema vào đây
  @Prop({ type: [SourceSchema] })
  sources!: Source[];

  @Prop({ type: String, required: true })
  episodeSlug!: string;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
EpisodeSchema.index({ anilistId: 1, episodeSlug: 1 });