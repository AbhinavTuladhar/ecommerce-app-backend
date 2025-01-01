import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'price cannot be negative' })
  price: number;

  @ApiProperty()
  @IsOptional()
  image: string | null;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'quantity cannot be negative' })
  quantity: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}
