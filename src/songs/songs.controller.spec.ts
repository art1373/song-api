import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { NotFoundException } from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  const mockSongsService = {
    getAllSongs: jest.fn(),
    createSong: jest.fn(),
    updateSong: jest.fn(),
    deleteSong: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: mockSongsService,
        },
        FileUploadService,
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of songs', async () => {
      const songs = [
        { id: '1', name: 'Song 1', artist: 'Artist 1', imageUrl: 'url1' },
        { id: '2', name: 'Song 2', artist: 'Artist 2', imageUrl: 'url2' },
      ];
      mockSongsService.getAllSongs.mockResolvedValue(songs);

      const result = await controller.findAll();
      expect(service.getAllSongs).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });
  });

  describe('create', () => {
    it('should create and return a new song', async () => {
      const dto: CreateSongDto = { name: 'New Song', artist: 'New Artist' };
      const file: Express.Multer.File = {
        originalname: 'test.jpg',
        filename: 'test.jpg',
        path: 'uploads/test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from(''),
        fieldname: 'image',
        encoding: '7bit',
        destination: 'uploads',
        stream: null,
      };
      const createdSong = { id: '3', ...dto, imageUrl: 'uploads/test.jpg' };

      mockSongsService.createSong.mockResolvedValue(createdSong);

      const result = await controller.create(dto, file);
      expect(service.createSong).toHaveBeenCalledWith(
        dto.name,
        dto.artist,
        'uploads/test.jpg',
      );
      expect(result).toEqual(createdSong);
    });

    it('should use default image when no file is provided', async () => {
      const dto: CreateSongDto = { name: 'New Song', artist: 'New Artist' };
      const defaultFile: Express.Multer.File = {
        filename: 'default.webp',
      } as Express.Multer.File;
      const createdSong = { id: '4', ...dto, imageUrl: 'uploads/default.webp' };

      mockSongsService.createSong.mockResolvedValue(createdSong);

      const result = await controller.create(dto, defaultFile);
      expect(service.createSong).toHaveBeenCalledWith(
        dto.name,
        dto.artist,
        'uploads/default.webp',
      );
      expect(result).toEqual(createdSong);
    });
  });

  describe('update', () => {
    it('should update and return the song', async () => {
      const id = '1';
      const dto: CreateSongDto = {
        name: 'Updated Song',
        artist: 'Updated Artist',
      };
      const file: Express.Multer.File = {
        originalname: 'updated.jpg',
        filename: 'updated.jpg',
        path: 'uploads/updated.jpg',
        mimetype: 'image/jpeg',
        size: 2048,
        buffer: Buffer.from(''),
        fieldname: 'image',
        encoding: '7bit',
        destination: 'uploads',
        stream: null,
      };
      const updatedSong = { id, ...dto, imageUrl: 'uploads/updated.jpg' };

      mockSongsService.updateSong.mockResolvedValue(updatedSong);

      const result = await controller.update(id, dto, file);
      expect(service.updateSong).toHaveBeenCalledWith(
        id,
        dto.name,
        dto.artist,
        'uploads/updated.jpg',
      );
      expect(result).toEqual(updatedSong);
    });

    it('should use default image when no file is provided', async () => {
      const id = '2';
      const dto: CreateSongDto = {
        name: 'Updated Song',
        artist: 'Updated Artist',
      };
      const defaultFile: Express.Multer.File = {
        filename: 'default.webp',
      } as Express.Multer.File;
      const updatedSong = { id, ...dto, imageUrl: 'uploads/default.webp' };

      mockSongsService.updateSong.mockResolvedValue(updatedSong);

      const result = await controller.update(id, dto, defaultFile);
      expect(service.updateSong).toHaveBeenCalledWith(
        id,
        dto.name,
        dto.artist,
        'uploads/default.webp',
      );
      expect(result).toEqual(updatedSong);
    });
  });

  describe('remove', () => {
    it('should delete the song and return a success message', async () => {
      const id = '1';
      mockSongsService.deleteSong.mockResolvedValue(undefined);

      const result = await controller.remove(id);
      expect(service.deleteSong).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Song deleted successfully.' });
    });

    it('should throw NotFoundException if song not found', async () => {
      const id = 'non-existent-id';
      mockSongsService.deleteSong.mockRejectedValue(
        new NotFoundException(`Song with ID ${id} not found.`),
      );

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      expect(service.deleteSong).toHaveBeenCalledWith(id);
    });
  });
});
