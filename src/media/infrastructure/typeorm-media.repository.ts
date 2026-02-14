import { InjectRepository } from '@nestjs/typeorm';
import { MediaRepository } from '@/media/application/media.repository';
import { Media } from '@/media/domain/media.entity';
import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmMediaRepository extends MediaRepository {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    super();
  }

  async save(media: Media, manager?: EntityManager): Promise<Media> {
    const repo = manager ? manager.getRepository(Media) : this.mediaRepository;
    return await repo.save(media);
  }

  async remove(medias: Media[], manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Media) : this.mediaRepository;
    await repo.softRemove(medias);
  }
}
