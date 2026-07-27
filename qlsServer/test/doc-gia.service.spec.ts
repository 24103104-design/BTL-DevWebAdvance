import { NotFoundException } from '@nestjs/common';
import { DocGiaService } from '../src/doc-gia/doc-gia.service';
import { DocGiaEntity } from '../src/doc-gia/doc-gia.entity';

describe('DocGiaService', () => {
  let service: DocGiaService;
  let repository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    service = new DocGiaService(repository as any);
  });

  it('creates a reader successfully', async () => {
    const reader = { maDocGia: 'D1', hoTen: 'An' } as DocGiaEntity;
    repository.create.mockReturnValue(reader);
    repository.save.mockResolvedValue(reader);

    const result = await service.create({ maDocGia: 'D1', hoTen: 'An' } as any);

    expect(result).toEqual(reader);
  });

  it('updates an existing reader', async () => {
    const reader = { maDocGia: 'D1', hoTen: 'An' } as DocGiaEntity;
    repository.findOne.mockResolvedValue(reader);
    repository.save.mockResolvedValue({ ...reader, hoTen: 'Binh' });

    const result = await service.update('D1', { hoTen: 'Binh' } as any);

    expect(result.hoTen).toBe('Binh');
  });

  it('removes a reader', async () => {
    const reader = { maDocGia: 'D1', hoTen: 'An' } as DocGiaEntity;
    repository.findOne.mockResolvedValue(reader);
    repository.remove.mockResolvedValue(undefined);

    const result = await service.remove('D1');

    expect(result.message).toContain('Đã xóa độc giả D1');
  });

  it('throws not found when reader does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('D404')).rejects.toThrow(NotFoundException);
  });
});
