// src/songs/songs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Song } from '@prisma/client';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async getAllSongs(): Promise<Song[]> {
    return this.prisma.song.findMany();
  }

  async createSong(
    name: string,
    artist: string,
    imagePath: string,
  ): Promise<Song> {
    return this.prisma.song.create({
      data: {
        name,
        artist,
        imageUrl: imagePath,
      },
    });
  }

  async updateSong(
    id: string,
    name: string,
    artist: string,
    imagePath: string,
  ): Promise<Song> {
    return this.prisma.song.update({
      where: { id },
      data: {
        name,
        artist,
        imageUrl: imagePath,
      },
    });
  }

  async deleteSong(id: string): Promise<void> {
    try {
      await this.prisma.song.delete({ where: { id } });
    } catch (error) {
      console.log('Error deleting song:', error);
      throw new NotFoundException(`Song with ID ${id} not found.`);
    }
  }
}
