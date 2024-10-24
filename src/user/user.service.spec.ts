import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';

import { DatabaseModule } from 'src/database/database.module';
import { User } from 'src/entities/user.entity';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('find by non-UUID', () => {
    it('should throw an error if id is not a valid UUID', async () => {
      expect.assertions(1);
      try {
        await service.findById('1');
      } catch (error) {
        expect(error).toBeInstanceOf(QueryFailedError);
      }
    });
  });

  describe('find by UUID', () => {
    it('should return a user', async () => {
      const result = await service.findById(
        '462f9d1c-ca91-48c2-9789-2543c3f77f0e'
      );
      expect(result).toBeInstanceOf(User);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
