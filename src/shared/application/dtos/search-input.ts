import { SortDirectionEnum } from '../../domain/repositories/seachable-repository-contracts';

export type SearchInput<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirectionEnum;
  filter?: Filter;
};
