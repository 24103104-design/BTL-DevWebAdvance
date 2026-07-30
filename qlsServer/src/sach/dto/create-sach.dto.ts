import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSachDto {
  @IsNotEmpty({ message: 'Mã sách không được trống' })
  @IsString()
  @MaxLength(10, { message: 'Mã sách tối đa 10 ký tự' })
  maSach!: string;

  @IsNotEmpty({ message: 'Tên sách không được trống' })
  @IsString()
  @MaxLength(100, { message: 'Tên sách tối đa 100 ký tự' })
  tenSach!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Tác giả tối đa 50 ký tự' })
  tacGia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Nhà xuất bản tối đa 50 ký tự' })
  nhaXuatBan?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Năm xuất bản phải là số' })
  namXuatBan?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số' })
  @Min(0, { message: 'Số lượng không thể âm' })
  soLuong?: number;

  @IsOptional()
  @IsString()
  anhBia?: string;
}
