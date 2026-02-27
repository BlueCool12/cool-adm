export class ChatResponse {
  readonly jobId: string;

  private constructor(jobId: string) {
    this.jobId = jobId;
  }

  static from(result: { jobId: string }): ChatResponse {
    return new ChatResponse(result.jobId);
  }
}
