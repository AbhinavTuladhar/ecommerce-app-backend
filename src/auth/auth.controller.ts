import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';
import { RegisterDto } from 'src/user/dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard, RefreshTokenGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResourceName('User')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const userId = req.user.id as string;
    const refreshToken = req.user.refreshToken as string;

    // return req.user;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
