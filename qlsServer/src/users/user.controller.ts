import {
  BadRequestException,
  Controller,
  Get,
  Patch,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  role?: string;
  avatarUrl?: string | null;
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
      avatarUrl: req.user.avatarUrl ?? null,
      createdAt: req.user.createdAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        callback(null, allowed.includes(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Request() req: { user: RequestUser },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn ảnh đại diện');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'avatars');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Normalize filename and default to webp
    const baseName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '')}`;
    const fileName = `${baseName}.webp`;
    const destination = join(uploadDir, fileName);

    const buffer = file.buffer ?? Buffer.from('');

    // Try to use sharp to resize and convert to webp. Fallback to original buffer.
    try {
      const sharp = require('sharp');
      const processed = await sharp(buffer).resize(300, 300, { fit: 'cover' }).toFormat('webp').toBuffer();
      await writeFile(destination, processed);
    } catch (err) {
      // sharp not available or processing failed -> save original
      await writeFile(destination, buffer);
    }

    const avatarUrl = `/uploads/avatars/${fileName}`;
    const updatedUser = await this.userService.updateAvatarUrl(req.user.id, avatarUrl);

    return {
      avatarUrl,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
      },
    };
  }
}
