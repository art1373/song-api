// src/songs/songs.module.ts
import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // import PrismaModule to use PrismaService
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
