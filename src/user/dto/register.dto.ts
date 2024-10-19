import { IsEmail, IsEnum, IsString } from 'class-validator';

import { UserRole } from 'src/entities/user.entity';

export class RegisterDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
