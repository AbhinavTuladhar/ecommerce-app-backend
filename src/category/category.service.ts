import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/entities/category.entity';

import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>
  ) {}

  async findAll(offset: number, limit: number) {
    const categories = await this.categoriesRepo.find({
      relations: ['products'],
      skip: offset,
      take: limit,
    });

    return categories.map(({ id, name, products }) => ({
      id,
      name,
      productCount: products.length,
    }));
  }
  async create(dto: CreateCategoryDto) {
    const category = this.categoriesRepo.create({ name: dto.name });
    return this.categoriesRepo.save(category);
  }

  async delete(id: string) {
    const category = await this.findById(id);
    return this.categoriesRepo.remove(category);
  }

  async update(id: string, dto: CreateCategoryDto) {
    const category = await this.findById(id);
    category.name = dto.name;
    return this.categoriesRepo.save(category);
  }

  async findById(id: string) {
    const category = await this.categoriesRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
