import { AiTaskResult, AiTaskStatus } from '@/ai/application/ai.service';

export class GetJobStatusResponse {
    readonly status: AiTaskStatus;
    readonly result?: any;
    readonly error?: string;
    readonly createdAt: number;

    private constructor(status: AiTaskStatus, createdAt: number, result?: any, error?: string) {
        this.status = status;
        this.createdAt = createdAt;
        this.result = result;
        this.error = error;
    }

    static from(task: AiTaskResult): GetJobStatusResponse {
        return new GetJobStatusResponse(task.status, task.createdAt, task.result, task.error);
    }
}
