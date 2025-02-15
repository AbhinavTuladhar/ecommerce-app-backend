import { ApiProperty } from '@nestjs/swagger';

export class CreateImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
