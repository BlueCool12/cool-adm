import { CommentStatus } from '@/comment/domain/comment-status.enum';

export class CommentItemResponse {
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
}

export class GetCommentsResponse {
  constructor(
    public readonly items: CommentItemResponse[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
