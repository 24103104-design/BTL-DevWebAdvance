import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SachService } from './sach.service';
import { SachEntity } from './sach.entity';

@Controller('sach')
export class SachController {
  constructor(private readonly sachService: SachService) {}

  @Post()
  create(@Body() data: Partial<SachEntity>) {
    return this.sachService.create(data);
  }

  @Get()
  findAll() {
    return this.sachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sachService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<SachEntity>) {
    return this.sachService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sachService.remove(id);
  }
}