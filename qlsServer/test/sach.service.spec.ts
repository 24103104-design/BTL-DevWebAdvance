import { NotFoundException } from '@nestjs/common';
import { SachService } from '../src/sach/sach.service';
import { SachEntity } from '../src/sach/sach.entity';

describe('SachService', () => {
  let service: SachService;
  let repository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    service = new SachService(repository as any);
  });

  it('creates a book successfully', async () => {
    const book = { maSach: 'S1', tenSach: 'Clean Code' } as SachEntity;
    repository.create.mockReturnValue(book);
    repository.save.mockResolvedValue(book);

    const result = await service.create({ maSach: 'S1', tenSach: 'Clean Code' } as any);

    expect(result).toEqual(book);
    expect(repository.create).toHaveBeenCalled();
  });

  it('updates an existing book', async () => {
    const book = { maSach: 'S1', tenSach: 'Old', soLuong: 2 } as SachEntity;
    repository.findOne.mockResolvedValue(book);
    repository.save.mockResolvedValue({ ...book, tenSach: 'New' });

    const result = await service.update('S1', { tenSach: 'New' } as any);

    expect(result.tenSach).toBe('New');
  });

  it('removes a book', async () => {
    const book = { maSach: 'S1' } as SachEntity;
    repository.findOne.mockResolvedValue(book);
    repository.remove.mockResolvedValue(undefined);

    const result = await service.remove('S1');

    expect(result.message).toContain('Đã xóa sách S1');
  });

  it('throws not found when searching for missing book', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('S404')).rejects.toThrow(NotFoundException);
  });
});
