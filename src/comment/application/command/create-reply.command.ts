export class CreateReplyCommand {
  constructor(
    public readonly parentId: string,
    public readonly content: string,
    public readonly adminId: string,
  ) {}
}
