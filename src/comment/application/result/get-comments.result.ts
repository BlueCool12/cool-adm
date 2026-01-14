import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { Comment } from '@/comment/domain/comment.entity';

export class CommentItemResult {
  constructor(
    public readonly id: string,
    public readonly nickname: string,
    public readonly content: string,
    public readonly isDeleted: boolean,
    public readonly status: CommentStatus,
    public readonly createdAt: string,
    public readonly parentId: string | null,
    public readonly adminId: string | null,
    public readonly post: {
      id: string;
      title: string;
      slug: string | null;
    },
    public readonly adminReplies?: {
      id: string;
      content: string;
      nickname: string;
      createdAt: string;
    }[],
  ) {}

  static fromEntity(entity: Comment): CommentItemResult {
    return new CommentItemResult(
      entity.id,
      entity.getNickname(),
      entity.getContent(),
      entity.getIsDeleted(),
      entity.getStatus(),
      entity.createdAt.toISOString(),
      entity.getParentId(),
      entity.getAdminId(),
      {
        id: entity.getPostId(),
        title: entity.getPost()?.getTitle() || '삭제된 게시글',
        slug: entity.getPost()?.getSlug(),
      },
      entity
        .getReplies()
        ?.filter((r) => r.getAdminId() !== null)
        .map((r) => ({
          id: r.id,
          content: r.getContent(),
          nickname: r.getNickname(),
          createdAt: r.createdAt.toISOString(),
        })),
    );
  }
}

export class GetCommentsResult {
  constructor(
    public readonly items: CommentItemResult[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}

  static fromEntities(
    entitiess: Comment[],
    total: number,
    page: number,
    limit: number,
  ): GetCommentsResult {
    const items = entitiess.map((entity) => CommentItemResult.fromEntity(entity));
    return new GetCommentsResult(items, total, page, limit);
  }
}
