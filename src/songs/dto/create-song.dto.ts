import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  artist: string;
}
