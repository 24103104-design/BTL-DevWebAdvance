import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhieuMuonEntity, TrangThaiPhieuMuon } from './phieu-muon.entity';
import { SachEntity } from '../sach/sach.entity';

@Injectable()
export class PhieuMuonService {
  constructor(
    @InjectRepository(PhieuMuonEntity)
    private readonly phieuMuonRepository: Repository<PhieuMuonEntity>,
    @InjectRepository(SachEntity)
    private readonly sachRepository: Repository<SachEntity>,
  ) {}

  // 1. Tạo mới phiếu mượn (Create)
  async create(data: Partial<PhieuMuonEntity>): Promise<PhieuMuonEntity> {
    if (!data.maSach) {
      throw new BadRequestException('Thiếu mã sách để tạo phiếu mượn');
    }

    const sach = await this.sachRepository.findOne({
      where: { maSach: data.maSach },
    });
    if (!sach) {
      throw new NotFoundException(`Không tìm thấy sách mã: ${data.maSach}`);
    }
    if (sach.soLuong <= 0) {
      throw new BadRequestException('Sách đã hết, không thể tạo phiếu mượn');
    }

    sach.soLuong -= 1;
    await this.sachRepository.save(sach);

    const newPhieu = this.phieuMuonRepository.create({
      ...data,
      trangThai: data.trangThai || TrangThaiPhieuMuon.DANG_MUON,
    });
    return await this.phieuMuonRepository.save(newPhieu);
  }

  async countByStatus(trangThai: string): Promise<number> {
    return this.phieuMuonRepository.count({ where: { trangThai } });
  }

  async countOverdue(): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .where('phieu.trangThai = :status', { status: 'Dang muon' })
      .andWhere('phieu.ngayHenTra IS NOT NULL')
      .andWhere('DATE(phieu.ngayHenTra) < :today', { today })
      .getCount();
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

  async returnBook(maPhieu: string): Promise<PhieuMuonEntity> {
    const phieu = await this.findOne(maPhieu);
    if (phieu.trangThai === TrangThaiPhieuMuon.DA_TRA) {
      throw new BadRequestException(`Phiếu mượn ${maPhieu} đã được trả`);
    }

    const sach = await this.sachRepository.findOne({
      where: { maSach: phieu.maSach },
    });
    if (!sach) {
      throw new NotFoundException(`Không tìm thấy sách mã: ${phieu.maSach}`);
    }

    phieu.trangThai = TrangThaiPhieuMuon.DA_TRA;
    phieu.ngayTraThucTe = new Date();

    sach.soLuong += 1;
    await this.sachRepository.save(sach);
    return await this.phieuMuonRepository.save(phieu);
  }

  async recentActivity(limit = 5) {
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select([
        'phieu.MaPhieu as maPhieu',
        'phieu.MaDocGia as maDocGia',
        'phieu.MaSach as maSach',
        'phieu.NgayMuon as ngayMuon',
        'phieu.NgayHenTra as ngayHenTra',
        'phieu.TrangThai as trangThai',
        'dg.HoTen as hoTen',
        's.TenSach as tenSach',
      ])
      .leftJoin('DOC_GIA', 'dg', 'dg.MaDocGia = phieu.MaDocGia')
      .leftJoin('SACH', 's', 's.MaSach = phieu.MaSach')
      .orderBy('phieu.NgayMuon', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async findOverdueDetails() {
    const today = new Date().toISOString().slice(0, 10);
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select([
        'phieu.MaPhieu as maPhieu',
        'phieu.MaDocGia as maDocGia',
        'phieu.MaSach as maSach',
        'phieu.NgayHenTra as ngayHenTra',
        'dg.HoTen as hoTen',
        's.TenSach as tenSach',
        `DATEDIFF(:today, phieu.NgayHenTra) as daysLate`,
      ])
      .leftJoin('DOC_GIA', 'dg', 'dg.MaDocGia = phieu.MaDocGia')
      .leftJoin('SACH', 's', 's.MaSach = phieu.MaSach')
      .where('phieu.TrangThai = :status', { status: 'Dang muon' })
      .andWhere('phieu.NgayHenTra IS NOT NULL')
      .andWhere('DATE(phieu.NgayHenTra) < :today', { today })
      .setParameter('today', today)
      .orderBy('phieu.NgayHenTra', 'ASC')
      .getRawMany();
  }

  async topBorrowedBooks(limit = 3) {
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select(['phieu.MaSach as maSach', 's.TenSach as tenSach', 's.TacGia as tacGia', 's.AnhBia as anhBia', 'COUNT(*) as borrowCount'])
      .leftJoin('SACH', 's', 's.MaSach = phieu.MaSach')
      .groupBy('phieu.MaSach')
      .orderBy('borrowCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async borrowTrend(options: { period?: string; startDate?: string; endDate?: string }) {
    const { period, startDate, endDate } = options;
    const now = new Date();

    let rangeStart: string;
    let periodType: 'daily' | 'weekly' | 'monthly' = 'daily';

    const parseDate = (value: string) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString().slice(0, 10);
    };

    if (startDate && endDate) {
      const parsedStart = parseDate(startDate);
      const parsedEnd = parseDate(endDate);
      if (!parsedStart || !parsedEnd) {
        throw new BadRequestException('startDate hoặc endDate không hợp lệ');
      }
      rangeStart = parsedStart;
      const diffDays = Math.round((new Date(parsedEnd).getTime() - new Date(parsedStart).getTime()) / (1000 * 3600 * 24));
      periodType = diffDays <= 30 ? 'daily' : diffDays <= 120 ? 'weekly' : 'monthly';
      return this.buildBorrowTrend(rangeStart, parsedEnd, periodType);
    }

    switch (period) {
      case '7d':
        rangeStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        periodType = 'daily';
        break;
      case '30d':
        rangeStart = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        periodType = 'daily';
        break;
      case '3m':
        rangeStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().slice(0, 10);
        periodType = 'weekly';
        break;
      case '1y':
        rangeStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
        periodType = 'monthly';
        break;
      default:
        rangeStart = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        periodType = 'daily';
        break;
    }

    return this.buildBorrowTrend(rangeStart, now.toISOString().slice(0, 10), periodType);
  }

  private async buildBorrowTrend(startDate: string, endDate: string, periodType: 'daily' | 'weekly' | 'monthly') {
    const periodExpression =
      periodType === 'monthly'
        ? `DATE_FORMAT(phieu.NgayMuon, '%Y-%m')`
        : periodType === 'weekly'
        ? `CONCAT(YEAR(phieu.NgayMuon), '-', WEEK(phieu.NgayMuon, 1))`
        : `DATE(phieu.NgayMuon)`;

    const query = this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select([`COUNT(*) as value`, `${periodExpression} as periodLabel`])
      .where('phieu.NgayMuon BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy(periodExpression)
      .orderBy('periodLabel', 'ASC');

    const rows = await query.getRawMany();
    return rows.map((row) => ({ period: row.periodLabel, count: Number(row.value) }));
  }

  async borrowByCategory() {
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select(["COALESCE(s.TacGia, 'Khác') as category", 'COUNT(*) as borrowCount'])
      .leftJoin('SACH', 's', 's.MaSach = phieu.MaSach')
      .groupBy("COALESCE(s.TacGia, 'Khác')")
      .orderBy('borrowCount', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async borrowStatus() {
    const rows = await this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select(['phieu.TrangThai as status', 'COUNT(*) as count'])
      .groupBy('phieu.TrangThai')
      .getRawMany();

    const statusMap = {
      'Dang muon': 'Đang mượn',
      'Da tra': 'Đã trả',
      'Qua han': 'Quá hạn',
    };

    return rows.map((row) => ({
      status: statusMap[row.status] || row.status,
      count: Number(row.count),
    }));
  }

  async topReaders(limit = 5) {
    return this.phieuMuonRepository
      .createQueryBuilder('phieu')
      .select(['dg.HoTen as name', 'COUNT(*) as totalBorrows'])
      .addSelect((subQuery) =>
        subQuery
          .select('COUNT(*)')
          .from(PhieuMuonEntity, 'innerPhieu')
          .where('innerPhieu.MaDocGia = phieu.MaDocGia')
          .andWhere('innerPhieu.TrangThai = :status', { status: 'Dang muon' }),
        'currentBorrows',
      )
      .leftJoin('DOC_GIA', 'dg', 'dg.MaDocGia = phieu.MaDocGia')
      .groupBy('phieu.MaDocGia')
      .orderBy('totalBorrows', 'DESC')
      .limit(limit)
      .getRawMany();
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
