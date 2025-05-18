import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { BadRequestException } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  let fileUploadService: FileUploadService;

  const mockFileUploadService = {
    validateAndGetPath: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  describe('uploadFile', () => {
    it('should return file upload success message with file path', () => {
      const mockFile: Express.Multer.File = {
        filename: 'test-file.png',
      } as Express.Multer.File;

      mockFileUploadService.validateAndGetPath.mockReturnValue(
        `uploads/${mockFile.filename}`,
      );

      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({
        message: 'File uploaded successfully',
        filePath: `uploads/${mockFile.filename}`,
      });
      expect(mockFileUploadService.validateAndGetPath).toHaveBeenCalledWith(
        mockFile,
      );
    });

    it('should throw BadRequestException when no file is uploaded', () => {
      mockFileUploadService.validateAndGetPath.mockImplementation(() => {
        throw new BadRequestException('No file uploaded');
      });

      expect(() => controller.uploadFile(undefined)).toThrow(
        BadRequestException,
      );
      expect(mockFileUploadService.validateAndGetPath).toHaveBeenCalledWith(
        undefined,
      );
    });
  });
});
