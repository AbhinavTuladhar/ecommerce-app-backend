import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';
import { UserRole } from 'src/entities/user.entity';
import { RegisterDto } from 'src/user/dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard, RefreshTokenGuard } from './guard';
import { RoleGuard } from './role/role.guard';
import { Roles } from './roles/roles.decorator';

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const tokenResponse = await this.authService.login(dto);

    response.cookie('accessToken', tokenResponse.accessToken, {
      httpOnly: true,
    });
    response.cookie('refreshToken', tokenResponse.refreshToken, {
      httpOnly: true,
    });

    return { message: 'Successfully logged in!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('is-admin')
  isAdmin(@Req() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refreshTokens(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    const userId = req.user.id as string;
    const refreshToken = req.user.refreshToken as string;

    const tokenResponse = await this.authService.refreshTokens(
      userId,
      refreshToken
    );

    response.cookie('accessToken', tokenResponse.accessToken, {
      httpOnly: true,
    });
    response.cookie('refreshToken', tokenResponse.refreshToken, {
      httpOnly: true,
    });

    return {
      message: 'Successfully logged in!',
    };
  }
}
