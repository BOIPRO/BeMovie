import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class GetTrendingAnime {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    amount!: number
}