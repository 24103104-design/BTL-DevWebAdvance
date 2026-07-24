import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { DocGiaService } from './doc-gia.service';
import { DocGiaEntity } from './doc-gia.entity';

// Kiểu giả lập Repository: chỉ mock những hàm mà service thực sự dùng
type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

function createMockRepository<
  T extends ObjectLiteral = any,
>(): MockRepository<T> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
}

describe('DocGiaService', () => {
  let service: DocGiaService;
  let repository: MockRepository<DocGiaEntity>;

  const mockDocGia: DocGiaEntity = {
    maDocGia: 'DG001',
    hoTen: 'Nguyen Van A',
    ngaySinh: new Date('2000-01-01'),
    soDienThoai: '0987654321',
    email: 'a@example.com',
    phieuMuons: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocGiaService,
        {
          provide: getRepositoryToken(DocGiaEntity),
          useValue: createMockRepository<DocGiaEntity>(),
        },
      ],
    }).compile();

    service = module.get<DocGiaService>(DocGiaService);
    repository = module.get(getRepositoryToken(DocGiaEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên được định nghĩa (defined)', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('nên tạo và lưu một độc giả mới', async () => {
      repository.create!.mockReturnValue(mockDocGia);
      repository.save!.mockResolvedValue(mockDocGia);

      const result = await service.create({
        maDocGia: 'DG001',
        hoTen: 'Nguyen Van A',
      });

      expect(repository.create).toHaveBeenCalledWith({
        maDocGia: 'DG001',
        hoTen: 'Nguyen Van A',
      });
      expect(repository.save).toHaveBeenCalledWith(mockDocGia);
      expect(result).toEqual(mockDocGia);
    });
  });

  describe('findAll', () => {
    it('nên trả về danh sách tất cả độc giả', async () => {
      repository.find!.mockResolvedValue([mockDocGia]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockDocGia]);
    });

    it('nên trả về mảng rỗng nếu chưa có độc giả nào', async () => {
      repository.find!.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('nên trả về đúng độc giả theo mã', async () => {
      repository.findOne!.mockResolvedValue(mockDocGia);

      const result = await service.findOne('DG001');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { maDocGia: 'DG001' },
      });
      expect(result).toEqual(mockDocGia);
    });

    it('nên ném NotFoundException nếu không tìm thấy độc giả', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('DG999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('nên cập nhật thông tin độc giả đã tồn tại', async () => {
      repository.findOne!.mockResolvedValue({ ...mockDocGia });
      repository.save!.mockImplementation((entity) => Promise.resolve(entity));

      const result = await service.update('DG001', {
        soDienThoai: '0123456789',
      });

      expect(result.soDienThoai).toBe('0123456789');
      expect(result.hoTen).toBe(mockDocGia.hoTen); // các trường khác giữ nguyên
      expect(repository.save).toHaveBeenCalled();
    });

    it('nên ném NotFoundException nếu cập nhật độc giả không tồn tại', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('DG999', { hoTen: 'Không tồn tại' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('nên xóa độc giả và trả về thông báo thành công', async () => {
      repository.findOne!.mockResolvedValue(mockDocGia);
      repository.remove!.mockResolvedValue(mockDocGia);

      const result = await service.remove('DG001');

      expect(repository.remove).toHaveBeenCalledWith(mockDocGia);
      expect(result).toEqual({
        message: 'Đã xóa độc giả DG001 thành công',
      });
    });

    it('nên ném NotFoundException nếu xóa độc giả không tồn tại', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.remove('DG999')).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
