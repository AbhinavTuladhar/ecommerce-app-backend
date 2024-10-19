import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
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
}
