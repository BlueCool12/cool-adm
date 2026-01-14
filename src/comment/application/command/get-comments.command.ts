import { CommentStatus } from '@/comment/domain/comment-status.enum';

export class GetCommentsCommand {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly status?: CommentStatus,
  ) {}
}
