import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/entities/category.entity';

import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoriesRepo: Repository<Category>
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    console.log('in the category service');
    console.log(dto);
    const category = this.categoriesRepo.create({ name: dto.name });
    return await this.categoriesRepo.save(category);
  }
}
