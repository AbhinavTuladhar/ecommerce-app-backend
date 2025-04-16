import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'Quantity cannot be negative' })
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsOptional()
  image?: string | null;
}
