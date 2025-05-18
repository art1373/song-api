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
import { multerConfig } from '../config/multer.config';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Song } from '@prisma/client';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  async findAll(): Promise<Song[]> {
    return this.songsService.getAllSongs();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = this.fileUploadService.validateAndGetPath(file);
    const { name, artist } = createSongDto;
    return this.songsService.createSong(name, artist, imagePath);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSongDto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = this.fileUploadService.validateAndGetPath(file);
    const { name, artist } = updateSongDto;
    return this.songsService.updateSong(id, name, artist, imagePath);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.songsService.deleteSong(id);
    return { message: 'Song deleted successfully.' };
  }
}
