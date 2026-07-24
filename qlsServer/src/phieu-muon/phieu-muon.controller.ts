import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhieuMuonService } from './phieu-muon.service';
import { CreatePhieuMuonDto } from './dto/create-phieumuon.dto';
import { UpdatePhieuMuonDto } from './dto/update-phieumuon.dto';

@Controller('phieu-muon')
export class PhieuMuonController {
  constructor(private readonly phieuMuonService: PhieuMuonService) {}

  @Post()
  create(@Body() data: CreatePhieuMuonDto) {
    return this.phieuMuonService.create(data);
  }

  @Get()
  findAll() {
    return this.phieuMuonService.findAll();
  }

  // Đặt trước ':id' để không bị nuốt mất bởi route generic bên dưới
  @Get('doc-gia/:maDocGia')
  lichSuTheoDocGia(@Param('maDocGia') maDocGia: string) {
    return this.phieuMuonService.lichSuTheoDocGia(maDocGia);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phieuMuonService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePhieuMuonDto) {
    return this.phieuMuonService.update(id, data);
  }

  @Patch(':id/tra-sach')
  traSach(@Param('id') id: string) {
    return this.phieuMuonService.traSach(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phieuMuonService.remove(id);
  }
}
