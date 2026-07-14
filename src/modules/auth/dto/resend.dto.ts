import { IsString, Min, Length, IsNotEmpty, IsEmail, Matches} from 'class-validator';
import { Transform } from 'class-transformer';
export class ResendDto {
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsEmail({}, { message: "Email không dúng định dạng." })
    email!: string;
}