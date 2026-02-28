export interface AutoSavePostCommandProps {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly contentJson?: string;
  readonly description?: string;
  readonly categoryId?: number;
}

export class AutoSavePostCommand {
  readonly props: AutoSavePostCommandProps;

  constructor(props: AutoSavePostCommandProps) {
    this.props = props;
  }
}
