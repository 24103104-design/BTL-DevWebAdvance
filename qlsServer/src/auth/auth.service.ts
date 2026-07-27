import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, fullName } = registerDto;

    const existingUser = await this.userService.findByUsername(username);
    if (existingUser !== null) {
      throw new ConflictException('Username đã được sử dụng');
    }

    const existingEmail = await this.userService.findByEmail(email);
    if (existingEmail !== null) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const user = await this.userService.create(username, email, password, 'user');

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: fullName?.trim() || user.username,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl ?? null,
        fullName: fullName?.trim() || user.username,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password, fullName } = loginDto;

    const user = await this.userService.findByUsername(username);

    if (user === null) {
      throw new UnauthorizedException('Username hoặc password không đúng');
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username hoặc password không đúng');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: fullName?.trim() || user.username,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl ?? null,
        fullName: fullName?.trim() || user.username,
      },
    };
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }
}
