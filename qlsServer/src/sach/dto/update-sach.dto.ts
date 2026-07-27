import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSachDto } from './create-sach.dto';

export class UpdateSachDto extends PartialType(
  OmitType(CreateSachDto, ['maSach'] as const),
) {}
