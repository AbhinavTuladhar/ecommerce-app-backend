import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';

import { RegisterDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    const isEmailUsed = Boolean(await this.usersRepo.findOneBy({ email }));
    if (isEmailUsed) {
      throw new ConflictException('Email is already in use.');
    }

    const hash = await argon.hash(password);
    const newUser = this.usersRepo.create({
      ...dto,
      password: hash,
    });
    return this.usersRepo.save(newUser);
  }

  async findAll() {
    return this.usersRepo.find();
  }
}
