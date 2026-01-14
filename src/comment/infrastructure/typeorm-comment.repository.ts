import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@/comment/domain/comment.entity';
import { Repository } from 'typeorm';
import { CommentStatus } from '@/comment/domain/comment-status.enum';
import { CommentRepository } from '@/comment/application/comment.repository';

@Injectable()
export class TypeOrmCommentRepository extends CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super();
  }

  async save(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async findById(id: string): Promise<Comment | null> {
    return await this.commentRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  async findAll(options: {
    skip: number;
    take: number;
    status?: CommentStatus;
  }): Promise<[Comment[], number]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.replies', 'replies', 'replies.adminId IS NOT NULL')
      .where('comment.adminId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .skip(options.skip)
      .take(options.take);

    if (options.status) {
      query.andWhere('comment.status = :status', { status: options.status });
    }

    return await query.getManyAndCount();
  }
}
