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
import { PhieuMuonEntity } from './phieu-muon.entity';

@Controller('phieu-muon')
export class PhieuMuonController {
  constructor(private readonly phieuMuonService: PhieuMuonService) {}

  @Post()
  create(@Body() data: Partial<PhieuMuonEntity>) {
    return this.phieuMuonService.create(data);
  }

  @Get()
  findAll() {
    return this.phieuMuonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phieuMuonService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<PhieuMuonEntity>) {
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
