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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all songs' })
  @ApiResponse({
    status: 200,
    description: 'List of songs retrieved successfully.',
  })
  async findAll(): Promise<Song[]> {
    return this.songsService.getAllSongs();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ summary: 'Create a new song' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Song data',
    type: CreateSongDto,
  })
  @ApiResponse({ status: 201, description: 'Song created successfully.' })
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
  @ApiOperation({ summary: 'Update an existing song' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Updated song data',
    type: CreateSongDto,
  })
  @ApiResponse({ status: 200, description: 'Song updated successfully.' })
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
  @ApiOperation({ summary: 'Delete a song' })
  @ApiResponse({ status: 200, description: 'Song deleted successfully.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.songsService.deleteSong(id);
    return { message: 'Song deleted successfully.' };
  }
}
