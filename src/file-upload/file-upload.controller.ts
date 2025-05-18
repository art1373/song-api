import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { FileUploadService } from './file-upload.service';
import { Express } from 'express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload song image',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        artist: {
          type: 'string',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.fileUploadService.validateAndGetPath(file);
    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }
}
