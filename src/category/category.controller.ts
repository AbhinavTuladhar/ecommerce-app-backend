import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  @ResourceName('Category')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch('/:id')
  @ResourceName('Category')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateCategoryDto
  ) {
    return this.categoryService.update(id, dto);
  }

  @Delete('/:id')
  @ResourceName('Category')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.delete(id);
  }
}
