import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhieuMuonEntity } from './phieu-muon.entity';
import { PhieuMuonService } from './phieu-muon.service';
import { PhieuMuonController } from './phieu-muon.controller';
import { SachModule } from '../sach/sach.module';
import { DocGiaModule } from '../doc-gia/doc-gia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhieuMuonEntity]),
    SachModule,
    DocGiaModule,
  ],
  controllers: [PhieuMuonController],
  providers: [PhieuMuonService],
})
export class PhieuMuonModule {}
