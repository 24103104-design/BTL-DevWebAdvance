import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocGiaEntity } from './doc-gia.entity';
import { DocGiaService } from './doc-gia.service';
import { DocGiaController } from './doc-gia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocGiaEntity])],
  controllers: [DocGiaController],
  providers: [DocGiaService],
  exports: [DocGiaService],
})
export class DocGiaModule {}
