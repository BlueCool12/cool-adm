
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly aiServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServerUrl = this.configService.getOrThrow<string>('AI_SERVER_URL');
  }

  async suggestTopic(): Promise<{ category: string; topic: string }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ category: string; topic: string }>(
          `${this.aiServerUrl}/posts/suggest/topic`,
        ),
      );
      return data;
    } catch (error) {
      console.error('Failed to get suggestion from AI server:', error);
      throw new InternalServerErrorException(
        'Failed to get suggestion from AI server',
      );
    }
  }

  async suggestSlug(title: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ slug: string }>(
          `${this.aiServerUrl}/posts/suggest/slug`,
          { title },
        ),
      );
      return data.slug;
    } catch (error) {
      console.error('Failed to get slug suggestion from AI server:', error);
      throw new InternalServerErrorException(
        'Failed to get slug suggestion from AI server',
      );
    }
  }

  async chat(message: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ reply: string }>(`${this.aiServerUrl}/chat`, {
          message,
        }),
      );
      return data.reply;
    } catch (error) {
      console.error('Failed to chat with AI server:', error);
      throw new InternalServerErrorException('Failed to chat with AI server');
    }
  }

  async suggestSummary(content: string): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ summary: string }>(
          `${this.aiServerUrl}/posts/suggest/summary`,
          { content },
        ),
      );
      return data.summary;
    } catch (error) {
      console.error('Failed to get summary from AI server:', error);
      throw new InternalServerErrorException(
        'Failed to get summary from AI server',
      );
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
  }): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ status: string }>(
          `${this.aiServerUrl}/posts/index`,
          {
            id: params.id,
            title: params.title,
            slug: params.slug,
            description: params.description,
            content: params.content,
            category: params.category,
            published_at: params.publishedAt.toISOString(),
          },
        ),
      );
      return data.status === 'success';
    } catch (error) {
      console.error('Failed to index post on AI server:', error);
      return false;
    }
  }

  async deletePostIndex(id: string): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete<{ status: string }>(
          `${this.aiServerUrl}/posts/${id}/index`,
        ),
      );
      return data.status === 'success';
    } catch (error) {
      console.error('Failed to delete post index from AI server:', error);
      return false;
    }
  }
}
