import { InjectRepository } from '@nestjs/typeorm';
import { MediaRepository } from '@/media/application/media.repository';
import { Media } from '@/media/domain/media.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmMediaRepository extends MediaRepository {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    super();
  }

  async save(media: Media): Promise<Media> {
    return await this.mediaRepository.save(media);
  }

  async remove(medias: Media[]): Promise<void> {
    await this.mediaRepository.softRemove(medias);
  }
}
