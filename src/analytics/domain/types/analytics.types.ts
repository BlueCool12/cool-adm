export interface TrafficData {
  date: string;
  pv: number;
  uv: number;
}

export enum TrafficRange {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
}

export interface DailyVisitData {
  date: string;
  pv: string;
  uv: string;
}

export interface DistributionData {
  label: string;
  value: string;
}

export interface PostPerformanceData {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date;
  views: string;
  uv: string;
}

export interface MostViewedPostData {
  id: string;
  title: string;
  views: string;
}

export interface RecentCommentData {
  id: string;
  nickname: string;
  content: string;
  createdAt: Date;
}
