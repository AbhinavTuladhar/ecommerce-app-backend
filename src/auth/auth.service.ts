import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async register(dto: RegisterDto): Promise<User> {
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

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.usersRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const doesPasswordMatch = await argon.verify(user.password, password);
    if (!doesPasswordMatch) {
      throw new ForbiddenException('The password is incorrect.');
    }

    return {
      message: 'Successfully logged in!',
    };
  }

  getUsers() {
    return this.usersRepo.find();
  }
}
