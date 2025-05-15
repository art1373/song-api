// src/songs/songs.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findAll(): Promise<any> {
    const songs = await this.songsService.getAllSongs();
    return songs;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      file = { filename: 'default.webp' } as Express.Multer.File;
    }
    const { name, artist } = createSongDto;
    const fileName = file.filename;
    const imagePath = `uploads/${fileName}`;

    const newSong = await this.songsService.createSong(name, artist, imagePath);
    return newSong;
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      file = { filename: 'default.webp' } as Express.Multer.File;
    }
    const { name, artist } = updateSongDto;
    const fileName = file.filename;
    const imagePath = `uploads/${fileName}`;
    const updatedSong = await this.songsService.updateSong(
      id,
      name,
      artist,
      imagePath,
    );

    return updatedSong;
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.songsService.deleteSong(id);
    return { message: 'Song deleted successfully.' };
  }
}
