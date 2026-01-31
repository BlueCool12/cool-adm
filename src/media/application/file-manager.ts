export interface FileMetadata {
  path: string;
  birthtimeMs: number;
  filename: string;
}

export abstract class FileManager {
  abstract listAllFiles(): Promise<string[]>;

  abstract getFileMetadata(filename: string): Promise<FileMetadata | null>;

  abstract deleteFile(filename: string): Promise<void>;
}
