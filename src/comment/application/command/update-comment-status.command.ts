import { CommentStatus } from '@/comment/domain/comment-status.enum';

export class UpdateCommentStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: CommentStatus,
  ) {}
}
