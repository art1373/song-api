import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bohemian Rhapsody' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Queen' })
  artist: string;
}
