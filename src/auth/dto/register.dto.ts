import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';

import { UserRole } from 'src/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;
}
