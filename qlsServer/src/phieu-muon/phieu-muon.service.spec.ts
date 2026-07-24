import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { PhieuMuonService } from './phieu-muon.service';
import { PhieuMuonEntity, TrangThaiPhieuMuon } from './phieu-muon.entity';
import { SachService } from '../sach/sach.service';
import { DocGiaService } from '../doc-gia/doc-gia.service';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

function createMockRepository<
  T extends ObjectLiteral = any,
>(): MockRepository<T> {
  return {
    create: jest.fn().mockImplementation((d: Partial<T>) => d as T),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
}

describe('PhieuMuonService', () => {
  let service: PhieuMuonService;
  let repository: MockRepository<PhieuMuonEntity>;

  const mockPhieu: PhieuMuonEntity = {
    maPhieu: 'PM001',
    maDocGia: 'DG001',
    maSach: 'S001',
    ngayMuon: new Date('2026-01-01'),
    ngayHenTra: new Date('2026-01-15'),
    trangThai: TrangThaiPhieuMuon.DANG_MUON,
    docGia: {
      maDocGia: 'DG001',
      hoTen: 'Nguyen Van A',
      ngaySinh: new Date('2000-01-01'),
      soDienThoai: '0987654321',
      email: 'a@example.com',
      phieuMuons: [],
    },
    sach: {
      maSach: 'S001',
      tenSach: 'Sach A',
      tacGia: '',
      nhaXuatBan: '',
      namXuatBan: 2020,
      soLuong: 1,
      phieuMuons: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhieuMuonService,
        {
          provide: SachService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockPhieu.sach),
            update: jest.fn(),
          },
        },
        {
          provide: DocGiaService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PhieuMuonEntity),
          useValue: createMockRepository<PhieuMuonEntity>(),
        },
      ],
    }).compile();

    service = module.get<PhieuMuonService>(PhieuMuonService);
    repository = module.get(getRepositoryToken(PhieuMuonEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên được định nghĩa (defined)', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('nên tạo mới một phiếu mượn', async () => {
      repository.create!.mockReturnValue(mockPhieu);
      repository.save!.mockResolvedValue(mockPhieu);

      const result = await service.create({
        maPhieu: 'PM001',
        maDocGia: 'DG001',
        maSach: 'S001',
        ngayMuon: '2026-01-01',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockPhieu);
      expect(result).toEqual(mockPhieu);
    });

    it('nên áp dụng trạng thái mặc định "Dang muon" khi không truyền trangThai', async () => {
      const dataKhongTrangThai = {
        maPhieu: 'PM002',
        maDocGia: 'DG002',
        maSach: 'S002',
        ngayMuon: '2026-01-05',
      };
      repository.create!.mockImplementation((d) => d as PhieuMuonEntity);
      repository.save!.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.create(dataKhongTrangThai);

      // Service sẽ đặt trạng thái mặc định `Dang muon` khi tạo mới.
      expect(result.trangThai).toBe(TrangThaiPhieuMuon.DANG_MUON);
    });
  });

  describe('findAll', () => {
    it('nên trả về danh sách tất cả phiếu mượn', async () => {
      repository.find!.mockResolvedValue([mockPhieu]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockPhieu]);
    });
  });

  describe('findOne', () => {
    it('nên trả về đúng phiếu mượn theo mã', async () => {
      repository.findOne!.mockResolvedValue(mockPhieu);

      const result = await service.findOne('PM001');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { maPhieu: 'PM001' },
        relations: ['docGia', 'sach'],
      });
      expect(result).toEqual(mockPhieu);
    });

    it('nên ném NotFoundException nếu không tìm thấy phiếu mượn', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('PM999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('nên cập nhật trạng thái phiếu mượn (ví dụ: đánh dấu đã trả)', async () => {
      repository.findOne!.mockResolvedValue({ ...mockPhieu });
      repository.save!.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.update('PM001', {
        ngayHenTra: '2026-01-20',
      });

      expect(result.ngayHenTra).toEqual(new Date('2026-01-20'));
      expect(result.maDocGia).toBe(mockPhieu.maDocGia); // các trường khác không đổi
      expect(repository.save).toHaveBeenCalled();
    });

    it('nên ném NotFoundException nếu cập nhật phiếu mượn không tồn tại', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('PM999', { ngayHenTra: '2026-01-20' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('nên xóa phiếu mượn và trả về thông báo thành công', async () => {
      repository.findOne!.mockResolvedValue(mockPhieu);
      repository.remove!.mockResolvedValue(mockPhieu);

      const result = await service.remove('PM001');

      expect(repository.remove).toHaveBeenCalledWith(mockPhieu);
      expect(result).toEqual({
        message: 'Đã xóa thành công phiếu mượn PM001',
      });
    });

    it('nên ném NotFoundException nếu xóa phiếu mượn không tồn tại', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.remove('PM999')).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
