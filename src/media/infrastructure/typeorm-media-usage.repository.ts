import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '@/post/domain/post.entity';
import { User } from '@/user/domain/user.entity';

import { Repository } from 'typeorm';
import { MediaUsageRepository } from '@/media/application/media-usage.repository';

@Injectable()
export class TypeOrmMediaUsageRepository extends MediaUsageRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async getAllUsedImageFilenames(): Promise<Set<string>> {
    const usedImages = new Set<string>();

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .select(['post.content'])
      .getMany();

    const postRegex = /\/files\/([a-zA-Z0-9_\-./]+\.(png|jpg|jpeg|gif|webp))/g;

    posts.forEach((post) => {
      const content = post.getContent();
      if (!content) return;
      const matches = [...content.matchAll(postRegex)];
      matches.forEach((match) => usedImages.add(match[1]));
    });

    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.profileImageUrl'])
      .getMany();

    users.forEach((user) => {
      const rawUrl = user.getProfileImageUrl();
      if (!rawUrl) return;

      try {
        const url = new URL(rawUrl);
        const relativePath = url.pathname.replace(/^\/files\//, '');
        usedImages.add(decodeURIComponent(relativePath));
      } catch {
        const relativePath = rawUrl.replace(/^\/files\//, '');
        usedImages.add(relativePath);
      }
    });

    return usedImages;
  }
}
