import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SachEntity } from './sach.entity';

@Injectable()
export class SachService {
  constructor(
    @InjectRepository(SachEntity)
    private readonly sachRepository: Repository<SachEntity>,
  ) {}

  async create(data: Partial<SachEntity>): Promise<SachEntity> {
    const newSach = this.sachRepository.create(data);
    return await this.sachRepository.save(newSach);
  }

  async findAll(search?: string): Promise<SachEntity[]> {
    const query = this.sachRepository.createQueryBuilder('sach');

    if (search?.trim()) {
      const keyword = `%${search.trim().toLowerCase()}%`;
      query.where('LOWER(sach.MaSach) LIKE :keyword', { keyword })
        .orWhere('LOWER(sach.TenSach) LIKE :keyword', { keyword })
        .orWhere('LOWER(sach.TacGia) LIKE :keyword', { keyword })
        .orWhere('LOWER(sach.NhaXuatBan) LIKE :keyword', { keyword });
    }

    return await query.getMany();
  }

  async findOne(maSach: string): Promise<SachEntity> {
    const sach = await this.sachRepository.findOne({ where: { maSach } });
    if (!sach) throw new NotFoundException(`Không tìm thấy sách mã: ${maSach}`);
    return sach;
  }

  async update(maSach: string, data: Partial<SachEntity>): Promise<SachEntity> {
    const sach = await this.findOne(maSach);
    Object.assign(sach, data);
    return await this.sachRepository.save(sach);
  }

  async remove(maSach: string) {
    const sach = await this.findOne(maSach);
    await this.sachRepository.remove(sach);
    return { message: `Đã xóa sách ${maSach} thành công` };
  }
}
