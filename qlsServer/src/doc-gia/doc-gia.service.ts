import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocGiaEntity } from './doc-gia.entity';
import { CreateDocGiaDto } from './dto/create-docgia.dto';
import { UpdateDocGiaDto } from './dto/update-docgia.dto';

@Injectable()
export class DocGiaService {
  constructor(
    @InjectRepository(DocGiaEntity)
    private readonly docGiaRepository: Repository<DocGiaEntity>,
  ) {}

  async create(data: CreateDocGiaDto): Promise<DocGiaEntity> {
    const newDocGia = this.docGiaRepository.create({
      ...data,
      ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : undefined,
    });
    return await this.docGiaRepository.save(newDocGia);
  }

  async findAll(): Promise<DocGiaEntity[]> {
    return await this.docGiaRepository.find();
  }

  async findOne(maDocGia: string): Promise<DocGiaEntity> {
    const docGia = await this.docGiaRepository.findOne({ where: { maDocGia } });
    if (!docGia) {
      throw new NotFoundException(`Không tìm thấy độc giả mã: ${maDocGia}`);
    }
    return docGia;
  }

  async update(maDocGia: string, data: UpdateDocGiaDto): Promise<DocGiaEntity> {
    const docGia = await this.findOne(maDocGia);
    Object.assign(docGia, {
      ...data,
      ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : docGia.ngaySinh,
    });
    return await this.docGiaRepository.save(docGia);
  }

  async remove(maDocGia: string) {
    const docGia = await this.findOne(maDocGia);
    await this.docGiaRepository.remove(docGia);
    return { message: `Đã xóa độc giả ${maDocGia} thành công` };
  }
}
