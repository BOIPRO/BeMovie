import mongoose, { Schema } from 'mongoose';
const moviesSchema = new Schema({
    anilistId: { type: Number, required: true, unique: true },
    idMal: { type: Number, required: true },
    titleRomaji: { type: String, required: true, index: true },
    slug: { type: String, unique: true, index: true },
    titleEnglish: { type: String },
    coverImage: { type: String },
    genres: { type: [String], index: true },
    averageScore: { type: Number, index: true },
    popularity: { type: Number, index: true },
    trending: { type: Number, index: true },
    description: { type: String },
    status: { type: String,index :true },
    anilistUpdatedAt: { type: Number, index: true },
    isAdult: { type: Boolean },
    isPublished: { type: Boolean, default: false, index: true },
    lastChecked: { type: Date, index: true },
    checkAttempts: { type: Number, index: true },
    episodes : {type : Number,require : true},
    nextAiringEpisode : {
        episode : {type : Number}
    },
    isComplete : {type :Boolean,index : true }
})
const episodeSchema = new Schema ({
        anilistId: {type : Number ,required : true , index : true},
        episodeNumber : {type : String},
        server: {type : String},
        episodeId: { type : String, required: true ,index : true},
        url: { type : String, default: ""},
        episodeSlug : {type : String, required : true,index : true}
})
export const ConnectModel = async (config) => {
    const { dbUrl } = config
    await mongoose.connect(`${dbUrl}`)
}
export const Movies = mongoose.model('movies',moviesSchema)
export const Episodes = mongoose.model('episodes',episodeSchema)