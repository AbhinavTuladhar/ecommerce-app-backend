import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryService } from 'src/category/category.service';
import { Product } from 'src/entities/product.entity';

import { UpdateProductDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private categoryService: CategoryService
  ) {}

  getAll() {
    return this.productRepo.find({ relations: ['category'] });
  }

  async getById(id: string) {
    return this.findById(id);
  }

  async create(dto: CreateProductDto) {
    const { categoryId, ...rest } = dto;

    const category = await this.categoryService.findById(categoryId);
    const product = this.productRepo.create({ category, ...rest });
    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);
    const { categoryId, ...rest } = dto;

    // Change the category of the product only if the corresponding category id is provided.
    if (categoryId) {
      const category = await this.categoryService.findById(categoryId);
      product.category = category;
    }
    Object.assign(product, rest);
    return this.productRepo.save(product);
  }

  async delete(id: string) {
    const product = await this.findById(id);
    return this.productRepo.remove(product);
  }

  async findById(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
