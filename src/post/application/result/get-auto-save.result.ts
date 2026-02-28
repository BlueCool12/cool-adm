export class GetAutoSaveResult {
  constructor(
    readonly title?: string,
    readonly content?: string,
    readonly contentJson?: string,
    readonly description?: string,
    readonly categoryId?: number,
    readonly savedAt?: Date,
  ) { }

  static fromData(data: any): GetAutoSaveResult {
    return new GetAutoSaveResult(
      data.title,
      data.content,
      data.contentJson,
      data.description,
      data.categoryId,
      data.savedAt ? new Date(data.savedAt) : undefined,
    );
  }
}
