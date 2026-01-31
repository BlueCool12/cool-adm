import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileManager, FileMetadata } from '@/media/application/file-manager';

import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalFileManager extends FileManager {
  private readonly logger = new Logger(LocalFileManager.name);
  private readonly ROOT_DIR: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.ROOT_DIR = this.configService.getOrThrow<string>('UPLOAD_ROOT_DIR');
  }

  async listAllFiles(): Promise<string[]> {
    try {
      await fs.access(this.ROOT_DIR);

      const files: string[] = [];
      await this.scanDirectory(this.ROOT_DIR, files);

      return files;
    } catch {
      this.logger.warn(`파일 목록 조회 실패 (경로: ${this.ROOT_DIR})`);
      return [];
    }
  }

  async getFileMetadata(relativePath: string): Promise<FileMetadata | null> {
    try {
      const fullPath = path.join(this.ROOT_DIR, relativePath);
      const stat = await fs.stat(fullPath);

      return {
        path: fullPath,
        birthtimeMs: stat.birthtimeMs,
        filename: relativePath,
      };
    } catch {
      return null;
    }
  }

  async deleteFile(relativePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.ROOT_DIR, relativePath);
      await fs.unlink(fullPath);
      await this.cleanEmptyParents(fullPath);
    } catch (e) {
      this.logger.error(`파일 삭제 실패: ${relativePath}`, e);
    }
  }

  private async scanDirectory(directory: string, fileList: string[]) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath, fileList);
      } else {
        const relativePath = path.relative(this.ROOT_DIR, fullPath);
        fileList.push(relativePath.split(path.sep).join('/'));
      }
    }
  }

  private async cleanEmptyParents(filePath: string) {
    let dirPath = path.dirname(filePath);

    while (dirPath.startsWith(this.ROOT_DIR) && dirPath !== this.ROOT_DIR) {
      try {
        await fs.rmdir(dirPath);
        dirPath = path.dirname(dirPath);
      } catch {
        break;
      }
    }
  }
}
