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
      limits: { fileSize: 2 * 1024 * 1024 }, // limit image size to 2MB [oai_citation:9‡medium.com](https://medium.com/@ggluopeihai/nestjs-uploading-pictures-8f25f84ad31e#:~:text=%40Post%28%27%2FuploadImage%27%29%20%40UseInterceptors%28FileInterceptor%28%27file%27%2C%20,file%29)
    }),
  )
  async create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // When using FileInterceptor, the uploaded file info is available in 'file'
    // The DTO will contain the text fields (name, artist) due to ValidationPipe
    if (!file) {
      // Ideally, handle case when no file is provided
      throw new Error('Image file is required');
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
