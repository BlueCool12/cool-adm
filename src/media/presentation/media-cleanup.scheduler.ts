import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MediaCleanupService } from '@/media/application/service/media-cleanup.service';

@Injectable()
export class MediaCleanupScheduler {
  constructor(private readonly mediaCleanupService: MediaCleanupService) { }

  @Cron('0 4 1 * *', {
    timeZone: 'Asia/Seoul',
  })
  async handleCron() {
    await this.mediaCleanupService.execute();
  }
}
