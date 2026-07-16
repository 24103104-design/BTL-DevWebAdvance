import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: RequestUser }) {
    return {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt,
    };
  }
}
