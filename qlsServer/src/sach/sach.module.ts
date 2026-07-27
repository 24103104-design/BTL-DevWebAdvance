import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SachEntity } from './sach.entity';
import { SachService } from './sach.service';
import { SachController } from './sach.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SachEntity])],
  controllers: [SachController],
  providers: [SachService],
})
export class SachModule {}
