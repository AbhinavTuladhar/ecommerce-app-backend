import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10
  ) {
    return this.categoryService.findAll(offset, limit);
  }

  @Get('/:id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    const {
      name,
      products,
      id: categoryId,
    } = await this.categoryService.findById(id);
    return {
      name,
      id: categoryId,
      products: products.map((product) => product.id),
    };
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
