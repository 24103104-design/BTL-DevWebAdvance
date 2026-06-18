import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhieuMuonEntity } from './phieu-muon.entity';
import { PhieuMuonService } from './phieu-muon.service';
import { PhieuMuonController } from './phieu-muon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuMuonEntity])],
  controllers: [PhieuMuonController],
  providers: [PhieuMuonService],
})
export class PhieuMuonModule {}