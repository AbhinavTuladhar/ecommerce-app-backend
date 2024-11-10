import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/entities/category.entity';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  const categoryRepo = Repository<Category>;
  const repositoryToken = getRepositoryToken(Category);

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: repositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Category repository should be defined', () => {
    expect(categoryRepo).toBeDefined();
  });

  it('findAll -> should return a list of all categories', async () => {
    // Arrange
    const category: Category = {
      id: '1',
      name: 'category',
      products: [],
    };
    const categoryData = [category];
    jest.spyOn(mockRepo, 'find').mockResolvedValue(categoryData);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual(categoryData);
    expect(mockRepo.find).toHaveBeenCalled();
  });
});
