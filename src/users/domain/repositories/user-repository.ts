import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SeachableRepositoryInterface,
} from '@/shared/domain/repositories/seachable-repository-contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';

export type UserFilter = string;

export class UserSearchParams extends DefaultSearchParams<UserFilter> {}

export class UserSearchResult extends DefaultSearchResult<UserEntity, UserFilter> {}

export interface UserRepositoryInterface extends SeachableRepositoryInterface<
  UserEntity,
  UserFilter,
  UserSearchParams,
  UserSearchResult
> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>;
}
