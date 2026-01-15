import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/user/application/user.repository';
import { User } from '@/user/domain/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from './command/create-user.command';
import { GetUsersQuery } from './query/get-users.query';
import { GetUsersResult } from './result/get-users.result';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(command: CreateUserCommand): Promise<void> {
    const { loginId, password, name, nickname, role } = command;

    const existingUser = await this.userRepository.findByLoginId(loginId);
    if (existingUser) throw new ConflictException('이미 사용 중인 아이디입니다.');

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = User.create({ loginId, passwordHash, name, nickname, role });
    await this.userRepository.save(user);
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`해당 ID(${id})의 유저를 찾을 수 없습니다.`);
    return user;
  }

  async findAll(query: GetUsersQuery): Promise<GetUsersResult> {
    const [users, total] = await this.userRepository.findAll({
      skip: query.skip,
      take: query.take,
      role: query.role,
      search: query.search,
    });

    return GetUsersResult.fromEntities(users, total, query.page, query.limit);
  }
}
