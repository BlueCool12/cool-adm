import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@/media/domain/media.entity';
import { MediaController } from '@/media/presentation/media.controller';
import { MediaService } from '@/media/application/media.service';
import { MediaRepository } from '@/media/application/media.repository';
import { TypeOrmMediaRepository } from '@/media/infrastructure/typeorm-media.repository';
import { FileUploader } from '@/media/application/file-uploader';
import { LocalFileUploader } from '@/media/infrastructure/local-file-uploader';
import { MetadataExtractor } from '@/media/application/metadata-extractor';
import { SharpMetadataExtractor } from '@/media/infrastructure/sharp-metadata-extractor';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [
    MediaService,
    { provide: MediaRepository, useClass: TypeOrmMediaRepository },
    { provide: FileUploader, useClass: LocalFileUploader },
    { provide: MetadataExtractor, useClass: SharpMetadataExtractor },
  ],
  exports: [MediaService],
})
export class MediaModule {}
