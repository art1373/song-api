// src/songs/songs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Song } from '@prisma/client'; // Prisma generates Song type

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
    // Use Prisma to create a new song record
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
    // Use Prisma to update the song record
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
    // Attempt to delete; if song not found, Prisma will throw
    try {
      await this.prisma.song.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException(`Song with ID ${id} not found.`);
      }
    }
  }
}
