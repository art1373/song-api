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
    // Retrieve all songs
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
      file = { filename: 'default.webp' } as Express.Multer.File; // Example of assigning a default image
    }
    const { name, artist } = createSongDto;
    const fileName = file.filename; // Multer gives the stored file name
    const imagePath = `uploads/${fileName}`; // relative path to serve the image

    const newSong = await this.songsService.createSong(name, artist, imagePath);
    // Optionally, return the song data (or a DTO) – including an image URL for client usage.
    return newSong;
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    // ParseUUIDPipe will ensure the id param is a valid UUID, else throws 400 [oai_citation:10‡docs.nestjs.com](https://docs.nestjs.com/techniques/validation#:~:text=,%60ParseUUIDPipe) [oai_citation:11‡docs.nestjs.com](https://docs.nestjs.com/techniques/validation#:~:text=In%20addition%20to%20validating%20request,can%20use%20the%20following%20construct)
    await this.songsService.deleteSong(id);
    return { message: 'Song deleted successfully.' };
  }
}
