import { EntityManager } from 'typeorm';
import { Media } from '@/media/domain/media.entity';

export abstract class MediaRepository {
  abstract save(media: Media, manager?: EntityManager): Promise<Media>;

  abstract remove(medias: Media[], manager?: EntityManager): Promise<void>;
}
