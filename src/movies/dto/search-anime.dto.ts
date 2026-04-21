import { IsInt, IsString, Min ,Length,IsNotEmpty  } from 'class-validator';
import { Type } from 'class-transformer';
export class SearchAnime {
    @IsString()
    @Length(1,200)
    @IsNotEmpty()
    s! : string;
    
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number

    @Type(() =>Number)
    @IsInt()
    @Min(10)
    limit!: number
}
