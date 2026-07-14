import { IsString, IsNotEmpty, Length,Matches } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: "Email không được để trống." })
     @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username không có kí tự đặc biệt." })
    username!: string;

    @IsString()
    @IsNotEmpty({ message: "Mật khẩu không được để trống." })
    password!: string;
}
