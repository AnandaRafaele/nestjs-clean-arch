import { Entity } from '@/shared/domain/entities/entity';
import { RepositoryInterface } from './repository-contracts';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: Filter;
};

export class SearchParams {
  protected _page: number;
  protected _perPage: number;
  protected _sort: string;
  protected _sortDir: SortDirection;
  protected _filter: string;

  constructor(props: SearchProps) {
    this._page = props.page || 1;
    this._perPage = props.perPage || 15;
    this._sort = props.sort || 'createdAt';
    this._sortDir = props.sortDir || 'desc';
    this._filter = props.filter || '';
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    this._page = value;
  }

  get perPage(): number {
    return this._perPage;
  }

  private set perPage(value: number) {
    this._perPage = value;
  }

  get sort(): string {
    return this._sort;
  }

  private set sort(value: string) {
    this._sort = value;
  }

  get sortDir(): SortDirection {
    return this._sortDir;
  }

  private set sortDir(value: SortDirection) {
    this._sortDir = value;
  }

  get filter(): string {
    return this._filter;
  }

  private set filter(value: string) {
    this._filter = value;
  }
}

export interface SeachableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>;
}
