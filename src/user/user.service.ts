import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { hashPassword } from 'src/utils/argon.utils';

import { RegisterDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    const isEmailUsed = Boolean(await this.usersRepo.findOneBy({ email }));
    if (isEmailUsed) {
      throw new ConflictException('Email is already in use.');
    }

    const hash = await hashPassword(password);
    const newUser = this.usersRepo.create({
      ...dto,
      password: hash,
    });
    return this.usersRepo.save(newUser);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    return this.usersRepo.remove(user);
  }

  async findAll() {
    return this.usersRepo.find();
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
