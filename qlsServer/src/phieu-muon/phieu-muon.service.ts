import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhieuMuonEntity, TrangThaiPhieuMuon } from './phieu-muon.entity';
import { CreatePhieuMuonDto } from './dto/create-phieumuon.dto';
import { UpdatePhieuMuonDto } from './dto/update-phieumuon.dto';
import { SachService } from '../sach/sach.service';
import { DocGiaService } from '../doc-gia/doc-gia.service';

@Injectable()
export class PhieuMuonService {
  constructor(
    @InjectRepository(PhieuMuonEntity)
    private readonly phieuMuonRepository: Repository<PhieuMuonEntity>,
    private readonly sachService: SachService,
    private readonly docGiaService: DocGiaService,
  ) {}

  // Tạo mới phiếu mượn (Create) — nghiệp vụ mượn sách:
  // kiểm tra độc giả tồn tại, kiểm tra sách còn tồn kho, rồi trừ số lượng
  async create(data: CreatePhieuMuonDto): Promise<PhieuMuonEntity> {
    await this.docGiaService.findOne(data.maDocGia); // throws 404 nếu không có độc giả này

    const sach = await this.sachService.findOne(data.maSach); // throws 404 nếu không có sách này
    if (sach.soLuong <= 0) {
      throw new BadRequestException(
        `Sách "${sach.tenSach}" (mã ${sach.maSach}) đã hết, không thể cho mượn`,
      );
    }

    const newPhieu = this.phieuMuonRepository.create({
      ...data,
      ngayMuon: new Date(data.ngayMuon),
      ngayHenTra: data.ngayHenTra ? new Date(data.ngayHenTra) : undefined,
      trangThai: TrangThaiPhieuMuon.DANG_MUON,
    });
    const savedPhieu = await this.phieuMuonRepository.save(newPhieu);

    await this.sachService.update(sach.maSach, { soLuong: sach.soLuong - 1 });

    return savedPhieu;
  }

  // Lấy danh sách tất cả phiếu mượn (Read All), kèm thông tin độc giả + sách
  async findAll(): Promise<PhieuMuonEntity[]> {
    const list = await this.phieuMuonRepository.find({
      relations: ['docGia', 'sach'],
    });
    return this.danhDauQuaHan(list);
  }

  // Lấy thông tin chi tiết 1 phiếu mượn theo mã (Read One)
  async findOne(maPhieu: string): Promise<PhieuMuonEntity> {
    const phieu = await this.phieuMuonRepository.findOne({
      where: { maPhieu },
      relations: ['docGia', 'sach'],
    });
    if (!phieu) {
      throw new NotFoundException(
        `Không tìm thấy phiếu mượn có mã: ${maPhieu}`,
      );
    }
    const [phieuDaXetQuaHan] = await this.danhDauQuaHan([phieu]);
    return phieuDaXetQuaHan;
  }

  // Cập nhật ngày hẹn trả (Update)
  async update(
    maPhieu: string,
    data: UpdatePhieuMuonDto,
  ): Promise<PhieuMuonEntity> {
    const phieu = await this.findOne(maPhieu);
    Object.assign(phieu, {
      ngayHenTra: data.ngayHenTra
        ? new Date(data.ngayHenTra)
        : phieu.ngayHenTra,
    });
    return await this.phieuMuonRepository.save(phieu);
  }

  // Xóa phiếu mượn (Delete)
  async remove(maPhieu: string): Promise<{ message: string }> {
    const phieu = await this.findOne(maPhieu);
    await this.phieuMuonRepository.remove(phieu);
    return { message: `Đã xóa thành công phiếu mượn ${maPhieu}` };
  }

  // Trả sách — cập nhật trạng thái + ngày trả thực tế, hoàn lại số lượng sách
  async traSach(maPhieu: string): Promise<PhieuMuonEntity> {
    const phieu = await this.phieuMuonRepository.findOne({
      where: { maPhieu },
      relations: ['sach'],
    });
    if (!phieu) {
      throw new NotFoundException(
        `Không tìm thấy phiếu mượn có mã: ${maPhieu}`,
      );
    }
    if (phieu.trangThai === TrangThaiPhieuMuon.DA_TRA) {
      throw new BadRequestException(
        `Phiếu mượn ${maPhieu} đã được trả trước đó`,
      );
    }

    phieu.trangThai = TrangThaiPhieuMuon.DA_TRA;
    phieu.ngayTra = new Date();
    const savedPhieu = await this.phieuMuonRepository.save(phieu);

    const sach = await this.sachService.findOne(phieu.maSach);
    await this.sachService.update(sach.maSach, { soLuong: sach.soLuong + 1 });

    return savedPhieu;
  }

  // Lịch sử mượn trả theo độc giả
  async lichSuTheoDocGia(maDocGia: string): Promise<PhieuMuonEntity[]> {
    await this.docGiaService.findOne(maDocGia); // throws 404 nếu không có độc giả này
    const list = await this.phieuMuonRepository.find({
      where: { maDocGia },
      relations: ['sach'],
      order: { ngayMuon: 'DESC' },
    });
    return this.danhDauQuaHan(list);
  }

  // Helper: nếu phiếu đang "Dang muon" mà đã qua ngày hẹn trả thì tự động
  // đánh dấu "Qua han" (và lưu lại xuống DB để lần đọc sau không phải tính lại)
  private async danhDauQuaHan(
    danhSach: PhieuMuonEntity[],
  ): Promise<PhieuMuonEntity[]> {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const ketQua: PhieuMuonEntity[] = [];
    for (const phieu of danhSach) {
      const dangMuonVaQuaHan =
        phieu.trangThai === TrangThaiPhieuMuon.DANG_MUON &&
        phieu.ngayHenTra &&
        new Date(phieu.ngayHenTra) < homNay;

      if (dangMuonVaQuaHan) {
        phieu.trangThai = TrangThaiPhieuMuon.QUA_HAN;
        ketQua.push(await this.phieuMuonRepository.save(phieu));
      } else {
        ketQua.push(phieu);
      }
    }
    return ketQua;
  }
}
