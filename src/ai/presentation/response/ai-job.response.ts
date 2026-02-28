export class AiJobResponse {
  readonly jobId: string;

  private constructor(jobId: string) {
    this.jobId = jobId;
  }

  static from(result: { jobId: string }): AiJobResponse {
    return new AiJobResponse(result.jobId);
  }
}
