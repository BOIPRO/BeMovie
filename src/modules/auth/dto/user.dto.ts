import { IsInt, IsString, Min, Length, IsNotEmpty, IsEmail, Matches,IsStrongPassword} from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateUserDto {
    // @IsString()
    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsEmail({}, { message: "Email không dúng định dạng." })
    // email!: string;
    @IsString()
    @IsNotEmpty({ message: "Không được để trống." })
    @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username không có kí tự đặc biệt." })
    username!: string;
    @IsString()
    @Length(8, 64, { message: 'Mật khẩu phải từ 8 đến 64 ký tự.' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'Mật khẩu quá yếu! Cần có chữ hoa, chữ thường, số và ký tự đặc biệt'
    })
    password!: string;
}