import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SongsModule } from './songs/songs.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [PrismaModule, SongsModule, FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
