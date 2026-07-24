import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateDocGiaDto {
  @IsNotEmpty({ message: 'Mã độc giả không được trống' })
  @IsString()
  @MaxLength(10, { message: 'Mã độc giả tối đa 10 ký tự' })
  maDocGia!: string;

  @IsNotEmpty({ message: 'Họ tên không được trống' })
  @IsString()
  @MaxLength(50, { message: 'Họ tên tối đa 50 ký tự' })
  hoTen!: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh không hợp lệ (định dạng YYYY-MM-DD)' },
  )
  ngaySinh?: string;

  @IsOptional()
  @Matches(/^[0-9+\s-]{8,15}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  soDienThoai?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(50, { message: 'Email tối đa 50 ký tự' })
  email?: string;
}
