import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase } from '@/shared/application/usecases/use-case';
import {
  UserRepositoryInterface,
  UserSearchParams,
  UserSearchResult,
} from '@/users/domain/repositories/user-repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export class ListUsersUseCase implements UseCase<SearchInput, PaginationOutput<UserOutput>> {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: SearchInput): Promise<PaginationOutput<UserOutput>> {
    const params = new UserSearchParams(input);
    const searchResult = await this.userRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: UserSearchResult): PaginationOutput<UserOutput> {
    const items = searchResult.items.map(item => UserOutputMapper.toOutput(item));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
