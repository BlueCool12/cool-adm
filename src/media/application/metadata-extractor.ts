import { MediaType } from '@/media/domain/media-type.enum';
import { MediaMetadata } from '@/media/types/media.types';

export abstract class MetadataExtractor {
  abstract extract(file: Express.Multer.File, type: MediaType): Promise<MediaMetadata>;
}
