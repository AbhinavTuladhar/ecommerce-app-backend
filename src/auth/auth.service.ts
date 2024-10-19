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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

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

    const token = await this.getToken(user);

    return {
      message: 'Successfully logged in!',
      access_token: token,
    };
  }

  async getToken(user: User) {
    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return token;
  }

  getUsers() {
    return this.usersRepo.find();
  }
}
