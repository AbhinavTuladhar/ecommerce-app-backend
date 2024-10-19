import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async register(dto: RegisterDto) {
    const { password } = dto;

    const hash = await argon.hash(password);
    const newUser = this.usersRepo.create({
      ...dto,
      password: hash,
    });
    return this.usersRepo.save(newUser);
  }

  login() {
    return {
      message: 'Logged in.',
    };
  }

  getUsers() {
    return this.usersRepo.find();
  }
}
