import { MediaType } from '@/media/domain/media-type.enum';

export abstract class FileUploader {
  abstract upload(file: Express.Multer.File, type: MediaType): Promise<string>;
}
