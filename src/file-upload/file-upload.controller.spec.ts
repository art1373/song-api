import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { BadRequestException } from '@nestjs/common';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  describe('uploadFile', () => {
    it('should return file upload success message with file path', () => {
      const mockFile: Express.Multer.File = {
        path: 'uploads/test-file.txt',
      } as Express.Multer.File;

      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({
        message: 'File uploaded successfully',
        filePath: 'uploads/test-file.txt',
      });
    });

    it('should throw BadRequestException when no file is uploaded', () => {
      expect(() => controller.uploadFile(undefined)).toThrow(
        BadRequestException,
      );
    });
  });
});
