import { SearchInput } from '@/shared/application/dtos/search-input';
import { SortDirectionEnum } from '@/shared/domain/repositories/seachable-repository-contracts';

export class ListUsersDto implements SearchInput {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirectionEnum;
  filter?: string;
}
