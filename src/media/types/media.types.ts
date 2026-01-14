export interface BaseMetadata {
  mimeType: string;
  size: number;
}

export interface ImageMetadata extends BaseMetadata {
  width: number;
  height: number;
  format?: string;
  hasAlpha?: boolean;
  isAnimated?: boolean;
  dominantColor?: string;
}

export type MediaMetadata = ImageMetadata | BaseMetadata;
