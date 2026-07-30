import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: { findOne: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('cập nhật avatarUrl cho người dùng tồn tại', async () => {
    const user = { id: 'user-1', avatarUrl: null } as User;
    repository.findOne.mockResolvedValue(user);
    repository.save.mockResolvedValue({
      ...user,
      avatarUrl: '/uploads/avatars/demo.png',
    });

    const result = await service.updateAvatarUrl(
      'user-1',
      '/uploads/avatars/demo.png',
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(repository.save).toHaveBeenCalled();
    expect(result.avatarUrl).toBe('/uploads/avatars/demo.png');
  });

  it('ném NotFoundException khi người dùng không tồn tại', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.updateAvatarUrl('missing', '/uploads/avatars/demo.png'),
    ).rejects.toThrow(NotFoundException);
  });
});
