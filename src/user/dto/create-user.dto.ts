import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsEnum(UserRole)
  role: UserRole;
}
