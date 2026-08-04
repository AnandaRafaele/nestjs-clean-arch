import { SeachableRepositoryInterface } from '@/shared/domain/repositories/seachable-repository-contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';

export interface UserRepositoryInterface extends SeachableRepositoryInterface<
  UserEntity,
  any,
  any
> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>;
}
