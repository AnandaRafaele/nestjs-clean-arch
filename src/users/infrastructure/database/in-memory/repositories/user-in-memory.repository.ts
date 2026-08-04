import { ConflictError } from '../../../../../shared/domain/errors/conflict-error';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-error';
import { InMemoryRepository } from '../../../../../shared/domain/repositories/in-memory.repository';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../../domain/repositories/user-repository';

export class UserInMemory
  extends InMemoryRepository<UserEntity>
  implements UserRepositoryInterface
{
  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this._findUserByEmail(email);
    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }
    return user;
  }

  async emailExists(email: string): Promise<void> {
    const user = await this._findUserByEmail(email);
    if (user) {
      throw new ConflictError('User email already exists');
    }
  }

  protected async _findUserByEmail(
    email: string,
  ): Promise<UserEntity | undefined> {
    const user = this.items.find(item => item.email === email);
    return Promise.resolve(user);
  }
}
