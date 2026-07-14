import { IsString, Min, Length, IsNotEmpty, IsEmail, Matches} from 'class-validator';
import { Transform } from 'class-transformer';
export class VerifyEmail {
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsEmail({}, { message: "Email không dúng định dạng." })
    email!: string;
    @IsString()
    @IsNotEmpty({ message: 'Mã OTP không được để trống' })
    @Length(6, 6, { message: 'Mã OTP phải có đúng 6 ký tự' })
    @Matches(/^[0-9]+$/, { 
    message: 'Mã OTP chỉ được chứa các chữ số, không bao gồm chữ cái hoặc ký tự đặc biệt' 
  })
  otp!:string

}