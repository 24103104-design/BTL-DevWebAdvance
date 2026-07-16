import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DocGiaService } from './doc-gia.service';
import { DocGiaEntity } from './doc-gia.entity';

@Controller('doc-gia')
export class DocGiaController {
  constructor(private readonly docGiaService: DocGiaService) {}

  @Post()
  create(@Body() data: Partial<DocGiaEntity>) {
    return this.docGiaService.create(data);
  }

  @Get()
  findAll() {
    return this.docGiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docGiaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<DocGiaEntity>) {
    return this.docGiaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docGiaService.remove(id);
  }
}
