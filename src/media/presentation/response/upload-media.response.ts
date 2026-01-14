export class UploadMediaResponse {
  readonly url: string;

  private constructor(url: string) {
    this.url = url;
  }

  static from(url: string): UploadMediaResponse {
    return new UploadMediaResponse(url);
  }
}
