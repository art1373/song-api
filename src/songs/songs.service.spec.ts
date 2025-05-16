import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaServiceMock, prismaServiceMock } from '../../test/prismaMock';
import { NotFoundException } from '@nestjs/common';

describe('SongsService', () => {
  let service: SongsService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    prisma = module.get(PrismaService) as PrismaServiceMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSongs', () => {
    it('should return an array of songs', async () => {
      const songs = [
        { id: '1', name: 'Song 1', artist: 'Artist 1', imageUrl: 'url1' },
        { id: '2', name: 'Song 2', artist: 'Artist 2', imageUrl: 'url2' },
      ];
      prisma.song.findMany.mockResolvedValue(songs);

      const result = await service.getAllSongs();
      expect(prisma.song.findMany).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });
  });

  describe('createSong', () => {
    it('should create and return a new song', async () => {
      const name = 'New Song';
      const artist = 'New Artist';
      const imagePath = 'image/path.jpg';
      const createdSong = { id: '3', name, artist, imageUrl: imagePath };

      prisma.song.create.mockResolvedValue(createdSong);

      const result = await service.createSong(name, artist, imagePath);
      expect(prisma.song.create).toHaveBeenCalledWith({
        data: { name, artist, imageUrl: imagePath },
      });
      expect(result).toEqual(createdSong);
    });
  });

  describe('updateSong', () => {
    it('should update and return the song', async () => {
      const id = '1';
      const name = 'Updated Song';
      const artist = 'Updated Artist';
      const imagePath = 'updated/image.jpg';
      const updatedSong = { id, name, artist, imageUrl: imagePath };

      prisma.song.update.mockResolvedValue(updatedSong);

      const result = await service.updateSong(id, name, artist, imagePath);
      expect(prisma.song.update).toHaveBeenCalledWith({
        where: { id },
        data: { name, artist, imageUrl: imagePath },
      });
      expect(result).toEqual(updatedSong);
    });
  });

  describe('deleteSong', () => {
    it('should delete the song', async () => {
      const id = '1';
      prisma.song.delete.mockResolvedValue({
        id,
        name: 'Song',
        artist: 'Artist',
        imageUrl: 'url',
      });

      await expect(service.deleteSong(id)).resolves.toBeUndefined();
      expect(prisma.song.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException if song not found', async () => {
      const id = 'non-existent-id';
      prisma.song.delete.mockRejectedValue(new Error('Not Found'));

      await expect(service.deleteSong(id)).rejects.toThrow(NotFoundException);
      expect(prisma.song.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
