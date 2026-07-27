import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SachService } from './sach.service';
import { SachEntity } from './sach.entity';
import { CreateSachDto } from './dto/create-sach.dto';
import { UpdateSachDto } from './dto/update-sach.dto';

@Controller('sach')
export class SachController {
  constructor(private readonly sachService: SachService) {}

  @Post()
  create(@Body() data: CreateSachDto) {
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
  update(@Param('id') id: string, @Body() data: UpdateSachDto) {
    return this.sachService.update(id, data as Partial<SachEntity>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sachService.remove(id);
  }
}
