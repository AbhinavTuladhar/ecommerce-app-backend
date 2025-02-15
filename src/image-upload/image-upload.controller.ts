import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { CreateImageUploadDto } from './dto/create-image-upload.dto';
import { ImageUploadService } from './image-upload.service';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'For uploading images.',
    type: CreateImageUploadDto,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.imageUploadService.handleFileUpload(file);
  }
}
