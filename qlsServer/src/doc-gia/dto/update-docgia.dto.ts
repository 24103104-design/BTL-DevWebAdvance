import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDocGiaDto } from './create-docgia.dto';

export class UpdateDocGiaDto extends PartialType(
  OmitType(CreateDocGiaDto, ['maDocGia'] as const),
) {}
