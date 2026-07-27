import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let jwtService: any;

  beforeEach(() => {
    userService = {
      findByUsername: jest.fn(),
      create: jest.fn(),
      validatePassword: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    };
    authService = new AuthService(userService, jwtService);
  });

  it('registers a new user successfully', async () => {
    userService.findByUsername.mockResolvedValue(null);
    userService.create.mockResolvedValue({
      id: 'u1',
      username: 'alice',
      email: 'alice@test.com',
      role: 'user',
    });

    const result = await authService.register({
      username: 'alice',
      email: 'alice@test.com',
      password: 'secret123',
    } as any);

    expect(result.access_token).toBe('token');
    expect(result.user.username).toBe('alice');
    expect(userService.create).toHaveBeenCalledWith('alice', 'alice@test.com', 'secret123', 'user');
  });

  it('throws conflict when username already exists', async () => {
    userService.findByUsername.mockResolvedValue({ username: 'alice' });

    await expect(
      authService.register({ username: 'alice', email: 'alice@test.com', password: 'secret123' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('throws conflict when email already exists', async () => {
    userService.findByUsername.mockResolvedValue(null);
    userService.create.mockRejectedValue(new ConflictException('Email đã được sử dụng'));

    await expect(
      authService.register({ username: 'bob', email: 'bob@test.com', password: 'secret123' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('logs in successfully with correct credentials', async () => {
    userService.findByUsername.mockResolvedValue({
      id: 'u1',
      username: 'alice',
      email: 'alice@test.com',
      password: 'hashed',
      role: 'user',
    });
    userService.validatePassword.mockResolvedValue(true);

    const result = await authService.login({ username: 'alice', password: 'secret123' } as any);

    expect(result.access_token).toBe('token');
    expect(result.user.username).toBe('alice');
  });

  it('throws unauthorized when password is wrong', async () => {
    userService.findByUsername.mockResolvedValue({
      id: 'u1',
      username: 'alice',
      email: 'alice@test.com',
      password: 'hashed',
      role: 'user',
    });
    userService.validatePassword.mockResolvedValue(false);

    await expect(authService.login({ username: 'alice', password: 'wrong' } as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
