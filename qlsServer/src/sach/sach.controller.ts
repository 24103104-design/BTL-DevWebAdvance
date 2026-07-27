import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { SachService } from './sach.service';
import { SachEntity } from './sach.entity';
import { CreateSachDto } from './dto/create-sach.dto';
import { UpdateSachDto } from './dto/update-sach.dto';

@Controller('sach')
export class SachController {
  constructor(private readonly sachService: SachService) {}

  private async saveCoverFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads', 'covers');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '')}`;
    const destination = join(uploadDir, fileName);
    const fileBuffer = file.buffer ?? Buffer.from('');
    await writeFile(destination, fileBuffer);

    return `/uploads/covers/${fileName}`;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('anhBia', {
      storage: memoryStorage(),
      fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const isAllowed = allowedMimeTypes.includes(file.mimetype);
        callback(null, isAllowed);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() data: CreateSachDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg|image/png|image/webp' }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      data.anhBia = await this.saveCoverFile(file);
    }
    return this.sachService.create(data as Partial<SachEntity>);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.sachService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sachService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('anhBia', {
      storage: memoryStorage(),
      fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const isAllowed = allowedMimeTypes.includes(file.mimetype);
        callback(null, isAllowed);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSachDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg|image/png|image/webp' }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      data.anhBia = await this.saveCoverFile(file);
    }
    return this.sachService.update(id, data as Partial<SachEntity>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sachService.remove(id);
  }
}
