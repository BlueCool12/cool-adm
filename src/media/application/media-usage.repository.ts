export abstract class MediaUsageRepository {
  abstract getAllUsedImageFilenames(): Promise<Set<string>>;
}
