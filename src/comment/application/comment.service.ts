import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '@/comment/application/comment.repository';
import { GetCommentsResult } from '@/comment/application/result/get-comments.result';
import { GetCommentsCommand } from '@/comment/application/command/get-comments.command';
import { UpdateCommentStatusCommand } from '@/comment/application/command/update-comment-status.command';
import { Comment } from '@/comment/domain/comment.entity';
import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { CreateReplyCommand } from '@/comment/application/command/create-reply.command';
import { UserService } from '@/user/application/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async findAll(command: GetCommentsCommand): Promise<GetCommentsResult> {
    const { page, limit, status } = command;

    const [comments, total] = await this.commentRepository.findAll({
      skip: (page - 1) * limit,
      take: limit,
      status,
    });

    return GetCommentsResult.fromEntities(comments, total, page, limit);
  }

  async updateStatus(command: UpdateCommentStatusCommand): Promise<void> {
    const comment = await this.getById(command.id);

    if (command.status === CommentStatus.HIDDEN) comment.hide();
    else if (command.status === CommentStatus.PUBLISHED) comment.publish();
    else if (command.status === CommentStatus.DELETED) comment.delete();

    await this.commentRepository.save(comment);
  }

  async createReply(command: CreateReplyCommand): Promise<void> {
    const { parentId, content, adminId } = command;

    const parent = await this.getById(parentId);

    const admin = await this.userService.getById(adminId);
    if (!admin) throw new NotFoundException('관리자 정보를 찾을 수 없습니다.');

    const adminPassword = this.configService.getOrThrow<string>('ADMIN_COMMENT_PASSWORD');

    const reply = Comment.createReply({
      postId: parent.getPostId(),
      parentId: parent.id,
      content: content,
      adminId: admin.id,
      nickname: admin.getNickname() ?? '관리자',
      password: adminPassword,
    });

    await this.commentRepository.save(reply);
  }

  private async getById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException(`해당 ID(${id})의 댓글을 찾을 수 없습니다.`);
    return comment;
  }
}
