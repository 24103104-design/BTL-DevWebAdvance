import { IsOptional, IsDateString } from 'class-validator';

export class UpdatePhieuMuonDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày hẹn trả không hợp lệ (định dạng YYYY-MM-DD)' },
  )
  ngayHenTra?: string;
}
