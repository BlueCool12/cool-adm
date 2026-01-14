export const MediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];
