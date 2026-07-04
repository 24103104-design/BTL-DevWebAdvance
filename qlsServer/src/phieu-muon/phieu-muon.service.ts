import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhieuMuonEntity } from './phieu-muon.entity';

@Injectable()
export class PhieuMuonService {
  constructor(
    @InjectRepository(PhieuMuonEntity)
    private readonly phieuMuonRepository: Repository<PhieuMuonEntity>,
  ) {}

  // 1. Tạo mới phiếu mượn (Create)
  async create(data: Partial<PhieuMuonEntity>): Promise<PhieuMuonEntity> {
    const newPhieu = this.phieuMuonRepository.create(data);
    return await this.phieuMuonRepository.save(newPhieu);
  }

  // 2. Lấy danh sách tất cả phiếu mượn (Read All)
  async findAll(): Promise<PhieuMuonEntity[]> {
    return await this.phieuMuonRepository.find();
  }

  // 3. Lấy thông tin chi tiết 1 phiếu mượn theo mã (Read One)
  async findOne(maPhieu: string): Promise<PhieuMuonEntity> {
    const phieu = await this.phieuMuonRepository.findOne({
      where: { maPhieu },
    });
    if (!phieu) {
      throw new NotFoundException(
        `Không tìm thấy phiếu mượn có mã: ${maPhieu}`,
      );
    }
    return phieu;
  }

  // 4. Cập nhật trạng thái / thông tin phiếu mượn (Update)
  async update(
    maPhieu: string,
    data: Partial<PhieuMuonEntity>,
  ): Promise<PhieuMuonEntity> {
    const phieu = await this.findOne(maPhieu);
    Object.assign(phieu, data);
    return await this.phieuMuonRepository.save(phieu);
  }

  // 5. Xóa phiếu mượn (Delete)
  async remove(maPhieu: string): Promise<{ message: string }> {
    const phieu = await this.findOne(maPhieu);
    await this.phieuMuonRepository.remove(phieu);
    return { message: `Đã xóa thành công phiếu mượn ${maPhieu}` };
  }
}
