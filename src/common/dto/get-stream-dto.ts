import { IsEnum, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
enum ProviderEnum {
  ANIMEVIETSUB = 'animevietsub',
}
enum ServerEnum {
  HDX = 'EMBED',
  DU = 'DU',
}
export class GetStreamQueryDto {
    @IsNotEmpty({ message: 'anilistId không được để trống' })
  @Transform(({ value }) => Number(value)) // Tự động đổi từ chuỗi "199588" thành số 199588
  @IsNumber({}, { message: 'anilistId phải là một số hợp lệ' })
  anilistId!: number;

  @IsNotEmpty({ message: 'episodeSlug không được để trống' })
  @IsString({ message: 'episodeSlug phải là một chuỗi ký tự' })
  episodeSlug!: string;
  @IsNotEmpty({ message: 'Provider không được để trống' })
  @IsEnum(ProviderEnum, { 
    message: 'Provider bắt buộc phải là ANIMEVIETSUB' 
  })
  provider!: ProviderEnum;

  @IsOptional() // Hoặc @IsNotEmpty() nếu server là bắt buộc
  @IsEnum(ServerEnum, { 
    message: 'Server chỉ có thể là HDX hoặc DU' 
  })
  server!: ServerEnum;
}