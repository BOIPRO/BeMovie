import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class GetAnime {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number

    @Type(() =>Number)
    @IsInt()
    @Min(10)
    limit!: number
}
