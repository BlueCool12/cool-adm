
import { Injectable, InternalServerErrorException, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '@/common/redis/redis.service';

export enum AiTaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface AiTaskResult {
  status: AiTaskStatus;
  result?: any;
  error?: string;
  createdAt: number;
}

@Injectable()
export class AiService {
  private readonly TASK_TTL = 3600; // 1 hour

  constructor(
    @Inject('AI_CLIENT') private readonly aiClient: ClientProxy,
    private readonly redisService: RedisService,
  ) { }

  private async createJob(type: string, payload: any): Promise<string> {
    const jobId = uuidv4();
    const initialTask: AiTaskResult = {
      status: AiTaskStatus.PENDING,
      createdAt: Date.now(),
    };

    await this.redisService.set(`ai_task:${jobId}`, initialTask, this.TASK_TTL);

    this.aiClient.emit({ cmd: type }, { jobId, ...payload });

    return jobId;
  }

  async getJobStatus(jobId: string): Promise<AiTaskResult> {
    const task = await this.redisService.get<AiTaskResult>(`ai_task:${jobId}`);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async suggestTopic(): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('suggest_topic', {});
      return { jobId };
    } catch (error) {
      console.error('Failed to create suggest_topic job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }

  async suggestSlug(title: string): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('suggest_slug', { title });
      return { jobId };
    } catch (error) {
      console.error('Failed to create suggest_slug job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }

  async chat(message: string): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('chat', { message });
      return { jobId };
    } catch (error) {
      console.error('Failed to create chat job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }

  async suggestSummary(content: string): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('suggest_summary', { content });
      return { jobId };
    } catch (error) {
      console.error('Failed to create suggest_summary job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }

  async indexPost(params: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    publishedAt: Date;
  }): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('index_post', {
        id: params.id,
        title: params.title,
        slug: params.slug,
        description: params.description,
        content: params.content,
        category: params.category,
        published_at: params.publishedAt.toISOString(),
      });
      return { jobId };
    } catch (error) {
      console.error('Failed to create index_post job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }

  async deletePostIndex(id: string): Promise<{ jobId: string }> {
    try {
      const jobId = await this.createJob('delete_post_index', { id });
      return { jobId };
    } catch (error) {
      console.error('Failed to create delete_post_index job:', error);
      throw new InternalServerErrorException('Failed to process AI request');
    }
  }
}
