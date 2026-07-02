import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocGiaEntity } from './doc-gia.entity';

@Injectable()
export class DocGiaService {
  constructor(
    @InjectRepository(DocGiaEntity)
    private readonly docGiaRepository: Repository<DocGiaEntity>,
  ) {}

  async create(data: Partial<DocGiaEntity>): Promise<DocGiaEntity> {
    const newDocGia = this.docGiaRepository.create(data);
    return await this.docGiaRepository.save(newDocGia);
  }

  async findAll(): Promise<DocGiaEntity[]> {
    return await this.docGiaRepository.find();
  }

  async findOne(maDocGia: string): Promise<DocGiaEntity> {
    const docGia = await this.docGiaRepository.findOne({ where: { maDocGia } });
    if (!docGia) throw new NotFoundException(`Không tìm thấy độc giả mã: ${maDocGia}`);
    return docGia;
  }

  async update(maDocGia: string, data: Partial<DocGiaEntity>): Promise<DocGiaEntity> {
    const docGia = await this.findOne(maDocGia);
    Object.assign(docGia, data);
    return await this.docGiaRepository.save(docGia);
  }

  async remove(maDocGia: string) {
    const docGia = await this.findOne(maDocGia);
    await this.docGiaRepository.remove(docGia);
    return { message: `Đã xóa độc giả ${maDocGia} thành công` };
  }
}