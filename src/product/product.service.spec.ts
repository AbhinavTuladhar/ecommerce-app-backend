import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';

import { CreateProductDto } from './dto';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  const productRepo = Repository<Product>;
  const repoToken = getRepositoryToken(Product);

  const mockProductRepo = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  const mockCategoryService = {
    findById: jest.fn(),
  };

  const category: Category = {
    id: '1',
    name: 'category',
    products: [],
  };

  const product: Product = {
    category: {
      id: '1',
      name: 'category',
      products: [],
    },
    description: 'description',
    id: '1',
    name: 'product',
    price: 0,
    quantity: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: repoToken,
          useValue: mockProductRepo,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Product repository should be defined', () => {
    expect(productRepo).toBeDefined();
  });

  it('getAll -> should fetch a list of all the categories', async () => {
    // Arrange
    const productData = [product];
    jest.spyOn(mockProductRepo, 'find').mockResolvedValue([product]);

    // Act
    const result = await service.getAll();

    // Assert
    expect(result).toEqual(productData);
    expect(mockProductRepo.find).toHaveBeenCalled();
  });

  it('getById -> Should return a category on the basis of the id', async () => {
    // Arrange
    jest.spyOn(mockProductRepo, 'findOneBy').mockResolvedValue(product);

    // Act
    const result = await service.getById('1');

    // Assert
    expect(result).toEqual(product);
    expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('create -> should create a product and return it', async () => {
    // Arrange
    const createDto: CreateProductDto = {
      categoryId: '1',
      name: 'product',
      description: 'description',
      price: 0,
      quantity: 0,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryId, ...rest } = createDto;

    const finalDto = {
      category,
      ...rest,
    };

    const createdProduct: Product = product;

    const mockedCategoryId = '1';

    jest.spyOn(mockCategoryService, 'findById').mockResolvedValue(category);
    jest.spyOn(mockProductRepo, 'create').mockReturnValue(createdProduct);
    jest.spyOn(mockProductRepo, 'save').mockResolvedValue(createdProduct);

    // Act
    const result = await service.create(createDto);

    // Assert
    expect(mockCategoryService.findById).toHaveBeenCalledWith(mockedCategoryId);
    expect(mockProductRepo.create).toHaveBeenCalledWith(finalDto);
    expect(mockProductRepo.save).toHaveBeenCalledWith(createdProduct);
    expect(result).toEqual(createdProduct);
  });
});
