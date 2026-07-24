import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreatePhieuMuonDto {
  @IsNotEmpty({ message: 'Mã phiếu không được trống' })
  @IsString()
  @MaxLength(10, { message: 'Mã phiếu tối đa 10 ký tự' })
  maPhieu!: string;

  @IsNotEmpty({ message: 'Mã độc giả không được trống' })
  @IsString()
  @MaxLength(10, { message: 'Mã độc giả tối đa 10 ký tự' })
  maDocGia!: string;

  @IsNotEmpty({ message: 'Mã sách không được trống' })
  @IsString()
  @MaxLength(10, { message: 'Mã sách tối đa 10 ký tự' })
  maSach!: string;

  @IsNotEmpty({ message: 'Ngày mượn không được trống' })
  @IsDateString(
    {},
    { message: 'Ngày mượn không hợp lệ (định dạng YYYY-MM-DD)' },
  )
  ngayMuon!: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày hẹn trả không hợp lệ (định dạng YYYY-MM-DD)' },
  )
  ngayHenTra?: string;
}
