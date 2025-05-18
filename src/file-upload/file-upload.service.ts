import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  validateAndGetPath(file: Express.Multer.File): string {
    return file?.filename ? `uploads/${file.filename}` : '';
  }
}
