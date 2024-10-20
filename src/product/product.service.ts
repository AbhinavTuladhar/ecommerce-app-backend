import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryService } from 'src/category/category.service';
import { Product } from 'src/entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private categoryService: CategoryService
  ) {}

  async create(dto: CreateProductDto) {
    const { categoryId, ...rest } = dto;

    const category = await this.categoryService.findCategoryById(categoryId);
    const product = this.productRepo.create({ category, ...rest });
    return this.productRepo.save(product);
  }

  getAll() {
    return this.productRepo.find();
  }
}
