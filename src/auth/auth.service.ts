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
import { hashPassword, verifyPassword } from 'src/utils/argon.utils';

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

    const doesPasswordMatch = await verifyPassword(user.password, password);
    if (!doesPasswordMatch) {
      throw new ForbiddenException('The password is incorrect.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'Successfully logged in!',
      role: user.role,
      ...tokens,
    };
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const doesPasswordMatch = await verifyPassword(user.password, password);
    if (!doesPasswordMatch) {
      throw new ForbiddenException('The password is incorrect.');
    }

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await hashPassword(refreshToken);
    await this.userService.update(userId, { refreshToken: hashedToken });
  }

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      role: user.role,
      // refreshToken: user.refreshToken,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        algorithm: 'HS256',
        expiresIn: '1h',
        secret: this.configService.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        algorithm: 'HS256',
        expiresIn: '10d',
        secret: this.configService.get('JWT_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied First');
    }

    const doesTokenMatch = await argon.verify(user.refreshToken, refreshToken);

    if (!doesTokenMatch) {
      throw new ForbiddenException('Access Denied Second');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, refreshToken);
    return tokens;
  }
}
