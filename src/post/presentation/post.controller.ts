import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UserRole } from '@/user/domain/user-role.enum';

import { Roles } from '@/auth/presentation/decorators/roles.decorator';
import { CreatePostResponse } from '@/post/presentation/response/create-post.response';
import { GetPostResponse } from '@/post/presentation/response/get-post.response';
import { GetPostsRequest } from '@/post/presentation/request/get-posts.request';
import { GetPostListResponse } from '@/post/presentation/response/get-post-list.response';
import { UpdatePostRequest } from '@/post/presentation/request/update-post.request';

import { PostService } from '@/post/application/post.service';
import { GetPostsQuery } from '@/post/application/query/get-posts.query';
import { UpdatePostCommand } from '@/post/application/command/update-post.command';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  async createDraft(): Promise<CreatePostResponse> {
    const result = await this.postService.createDraft();
    return CreatePostResponse.fromResult(result);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<GetPostResponse> {
    const result = await this.postService.getPost(id);
    return GetPostResponse.fromResult(result);
  }

  @Get()
  async getPosts(@Query() request: GetPostsRequest): Promise<GetPostListResponse> {
    const query = new GetPostsQuery({ ...request, categoryId: request.category });
    const result = await this.postService.getPosts(query);

    return GetPostListResponse.fromResult(result);
  }

  @Get('suggest/topic')
  @Roles(UserRole.ADMIN)
  async suggestTopic(): Promise<{ category: string; topic: string }> {
    return await this.postService.suggestTopic();
  }

  @Post('suggest/slug')
  @Roles(UserRole.ADMIN)
  async suggestSlug(@Body('title') title: string): Promise<{ slug: string }> {
    const slug = await this.postService.suggestSlug(title);
    return { slug };
  }

  @Post('suggest/summary')
  @Roles(UserRole.ADMIN)
  async suggestSummary(
    @Body('content') content: string,
  ): Promise<{ summary: string }> {
    const summary = await this.postService.suggestSummary(content);
    return { summary };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updatePost(
    @Param('id') id: string,
    @Body() request: UpdatePostRequest,
  ): Promise<GetPostResponse> {
    const command = new UpdatePostCommand({ id, ...request });
    const result = await this.postService.updatePost(command);
    return GetPostResponse.fromResult(result);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }
}
