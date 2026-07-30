import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { PhieuMuonService } from './phieu-muon.service';
import { PhieuMuonEntity, TrangThaiPhieuMuon } from './phieu-muon.entity';
import { SachEntity } from '../sach/sach.entity';

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
  let sachRepository: MockRepository<SachEntity>;

  const mockPhieu = {
    maPhieu: 'PM001',
    maDocGia: 'DG001',
    maSach: 'S001',
    ngayMuon: new Date('2026-01-01'),
    ngayHenTra: new Date('2026-01-15'),
    trangThai: TrangThaiPhieuMuon.DANG_MUON,
  } as unknown as PhieuMuonEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhieuMuonService,
        {
          provide: getRepositoryToken(PhieuMuonEntity),
          useValue: createMockRepository<PhieuMuonEntity>(),
        },
        {
          provide: getRepositoryToken(SachEntity),
          useValue: createMockRepository<SachEntity>(),
        },
      ],
    }).compile();

    service = module.get<PhieuMuonService>(PhieuMuonService);
    repository = module.get(getRepositoryToken(PhieuMuonEntity));
    sachRepository = module.get(getRepositoryToken(SachEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên được định nghĩa (defined)', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('nên tạo mới một phiếu mượn và trừ số lượng sách', async () => {
      const sach = { maSach: 'S001', soLuong: 2 } as SachEntity;
      const expectedPhieu = { ...mockPhieu, maPhieu: 'PM001' } as PhieuMuonEntity;

      sachRepository.findOne!.mockResolvedValue(sach);
      repository.create!.mockReturnValue(expectedPhieu);
      repository.save!.mockResolvedValue(expectedPhieu);
      sachRepository.save!.mockResolvedValue({ ...sach, soLuong: 1 });

      const result = await service.create({
        maPhieu: 'PM001',
        maDocGia: 'DG001',
        maSach: 'S001',
        ngayMuon: '2026-01-01',
      });

      expect(sachRepository.findOne).toHaveBeenCalledWith({ where: { maSach: 'S001' } });
      expect(sachRepository.save).toHaveBeenCalledWith(expect.objectContaining({ soLuong: 1 }));
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(expectedPhieu);
      expect(result).toEqual(expectedPhieu);
    });

    it('nên từ chối tạo phiếu mượn khi sách đã hết', async () => {
      sachRepository.findOne!.mockResolvedValue({ maSach: 'S001', soLuong: 0 } as SachEntity);

      await expect(
        service.create({
          maPhieu: 'PM002',
          maDocGia: 'DG002',
          maSach: 'S001',
          ngayMuon: '2026-01-05',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(sachRepository.save).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('returnBook', () => {
    it('nên trả sách thành công và cập nhật trạng thái + số lượng sách', async () => {
      const sach = { maSach: 'S001', soLuong: 1 } as SachEntity;
      const phieu = { ...mockPhieu } as PhieuMuonEntity;

      repository.findOne!.mockResolvedValue(phieu);
      repository.save!.mockImplementation((entity) => Promise.resolve(entity));
      sachRepository.findOne!.mockResolvedValue(sach);
      sachRepository.save!.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.returnBook('PM001');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { maPhieu: 'PM001' } });
      expect(sachRepository.findOne).toHaveBeenCalledWith({ where: { maSach: phieu.maSach } });
      expect(sachRepository.save).toHaveBeenCalledWith(expect.objectContaining({ maSach: 'S001', soLuong: 2 }));
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        maPhieu: 'PM001',
        trangThai: TrangThaiPhieuMuon.DA_TRA,
      }));
      expect(result.trangThai).toBe(TrangThaiPhieuMuon.DA_TRA);
      expect(result.ngayTraThucTe).toBeInstanceOf(Date);
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

      expect(result.ngayHenTra).toEqual('2026-01-20');
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
