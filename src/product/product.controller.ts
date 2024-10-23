import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';

import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(200)
  @Get()
  getAll() {
    return this.productService.getAll();
  }

  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.getById(id);
  }

  @Post()
  @ResourceName('Product')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch('/:id')
  @ResourceName('Product')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productService.update(id, dto);
  }

  @Delete('/:id')
  @ResourceName('Product')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.delete(id);
  }
}
