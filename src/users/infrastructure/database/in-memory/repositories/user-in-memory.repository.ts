import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepositoryInterface
{
  sortableFields: string[] = ['name', 'email', 'createdAt'];

  findByEmail(email: string): Promise<UserEntity> {
    const user = this._findUserByEmail(email);
    if (!user) {
      return Promise.reject(new NotFoundError(`User with email ${email} not found`));
    }
    return Promise.resolve(user);
  }

  emailExists(email: string): Promise<void> {
    const user = this._findUserByEmail(email);
    if (user) {
      return Promise.reject(new ConflictError('User email already exists'));
    }
    return Promise.resolve();
  }

  protected applyFilter(items: UserEntity[], filter: string | null): Promise<UserEntity[]> {
    if (!filter) {
      return Promise.resolve(items);
    }

    return Promise.resolve(
      items.filter(item => item.props.name.toLowerCase().includes(filter.toLowerCase())),
    );
  }

  protected _findUserByEmail(email: string): UserEntity | undefined {
    return this.items.find((item: UserEntity) => item.email === email);
  }
}
