import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirectionEnum } from '@/shared/domain/repositories/seachable-repository-contracts';
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

  protected applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirectionEnum | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', SortDirectionEnum.DESC)
      : super.applySort(items, sort, sortDir);
  }

  protected _findUserByEmail(email: string): UserEntity | undefined {
    return this.items.find((item: UserEntity) => item.email === email);
  }
}
