import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhieuMuonEntity } from './phieu-muon.entity';
import { SachEntity } from '../sach/sach.entity';
import { PhieuMuonService } from './phieu-muon.service';
import { PhieuMuonController } from './phieu-muon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuMuonEntity, SachEntity])],
  controllers: [PhieuMuonController],
  providers: [PhieuMuonService],
  exports: [PhieuMuonService],
})
export class PhieuMuonModule {}
