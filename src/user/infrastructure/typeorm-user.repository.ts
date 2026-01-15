import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/domain/user.entity';
import { Repository } from 'typeorm';
import { AuthCredential } from '@/auth/domain/auth-credential';
import { UserRepository } from '../application/user.repository';

export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findByLoginId(loginId: string): Promise<AuthCredential | null> {
    const user = await this.userRepository.findOne({
      where: {
        ['loginId' as keyof User]: loginId,
      },
    });
    if (!user) return null;

    const snapshot = user.getSnapshot();
    return AuthCredential.restore(snapshot);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async saveAuthStatus(snapshot: ReturnType<AuthCredential['getSnapshot']>): Promise<void> {
    await this.userRepository.update(snapshot.id, {
      failedAttempts: snapshot.failedAttempts,
      lockedUntil: snapshot.lockedUntil,
    });
  }

  async updateRefreshToken(userId: string, hash: string | null): Promise<void> {
    await this.userRepository.update(userId, {
      refreshTokenHash: hash,
    });
  }
}
