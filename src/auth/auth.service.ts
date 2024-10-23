import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    return this.userService.register(dto);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
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

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const doesPasswordMatch = await argon.verify(user.password, password);
    if (!doesPasswordMatch) {
      throw new ForbiddenException('The password is incorrect.');
    }

    return user;
  }

  async getToken(user: User) {
    const payload = { id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return token;
  }
}
