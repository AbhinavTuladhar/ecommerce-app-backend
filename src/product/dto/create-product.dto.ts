import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Min } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}
