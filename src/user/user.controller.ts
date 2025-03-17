import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';
import { UserRole } from 'src/entities/user.entity';

import { UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ResourceName('User')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.delete(id);
  }

  @Patch('/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.update(id, dto);
  }
}
