import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { Comment } from '@/comment/domain/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<Comment>;

  abstract findById(id: string): Promise<Comment | null>;

  abstract findAll(options: {
    skip: number;
    take: number;
    status?: CommentStatus;
  }): Promise<[Comment[], number]>;
}
