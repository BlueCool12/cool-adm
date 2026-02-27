import { AiTaskStatus } from '@/ai/domain/ai-task-status.enum';

export interface AiTaskResult {
  status: AiTaskStatus;
  result?: unknown;
  error?: string;
  createdAt: number;
}
