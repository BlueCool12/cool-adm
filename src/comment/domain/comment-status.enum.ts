export const CommentStatus = {
  PUBLISHED: 'PUBLISHED',
  HIDDEN: 'HIDDEN',
  DELETED: 'DELETED',
} as const;

export type CommentStatus = (typeof CommentStatus)[keyof typeof CommentStatus];
