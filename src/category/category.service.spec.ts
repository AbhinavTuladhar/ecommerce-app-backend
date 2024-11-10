import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/entities/category.entity';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

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
    findById: jest.fn(),
  };

  const category: Category = {
    id: '1',
    name: 'category',
    products: [],
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
    const categoryData = [category];
    jest.spyOn(mockRepo, 'find').mockResolvedValue(categoryData);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual(categoryData);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('findOne -> should return a category on the basis of the id', async () => {
    // Arrange
    jest.spyOn(mockRepo, 'findOneBy').mockResolvedValue(category);

    // Act
    const result = await service.findById('1');

    // Assert
    expect(result).toEqual(category);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('create -> should create a category and return it', async () => {
    // Arrange
    const createDto: CreateCategoryDto = {
      name: 'category',
    };
    const createdCategory: Category = {
      id: '1',
      name: 'category',
      products: [],
    };
    jest.spyOn(mockRepo, 'create').mockReturnValue(createdCategory);
    jest.spyOn(mockRepo, 'save').mockResolvedValue(createdCategory);

    // Act
    const result = await service.create(createDto);

    // Assert
    expect(mockRepo.create).toHaveBeenCalledWith(createDto);
    expect(mockRepo.save).toHaveBeenCalledWith(createdCategory);
    expect(result).toEqual(createdCategory);
  });

  it('delete -> should delete a category given a specific id', async () => {
    // Arrange
    jest.spyOn(mockRepo, 'findOneBy').mockResolvedValue(category);
    jest.spyOn(mockRepo, 'remove').mockResolvedValue(category);

    // Act
    const result = await service.delete('1');

    // Assert
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(mockRepo.remove).toHaveBeenCalledWith(category);
    expect(result).toEqual(category);
  });
});
