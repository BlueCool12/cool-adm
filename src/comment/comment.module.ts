import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/comment/domain/comment.entity';
import { CommentService } from '@/comment/application/comment.service';
import { CommentRepository } from '@/comment/application/comment.repository';
import { TypeOrmCommentRepository } from '@/comment/infrastructure/typeorm-comment.repository';
import { CommentController } from '@/comment/presentation/comment.controller';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    {
      provide: CommentRepository,
      useClass: TypeOrmCommentRepository,
    },
  ],
})
export class CommentModule {}
