import { Media } from '@/media/domain/media.entity';

export abstract class MediaRepository {
  abstract save(media: Media): Promise<Media>;

  abstract remove(medias: Media[]): Promise<void>;
}
