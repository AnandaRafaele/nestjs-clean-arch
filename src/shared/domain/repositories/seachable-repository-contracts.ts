import { Entity } from '@/shared/domain/entities/entity';
import { RepositoryInterface } from './repository-contracts';

export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirectionEnum | null;
  filter?: Filter | null;
};

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort?: string | null;
  sortDir?: SortDirectionEnum | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirectionEnum | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page ?? 1;
    this.perPage = props.perPage ?? 15;
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    this._page = this.validateNumber(value, 1);
  }

  get perPage(): number {
    return this._perPage;
  }

  private set perPage(value: number) {
    this._perPage = this.validateNumber(value, this._perPage);
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = this.isEmpty(value) ? null : `${value}`;
  }

  get sortDir(): SortDirectionEnum | null {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }

    const dir = `${value}`.toLowerCase() as SortDirectionEnum;

    this._sortDir = [SortDirectionEnum.ASC, SortDirectionEnum.DESC].includes(dir)
      ? dir
      : SortDirectionEnum.DESC;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter = this.isEmpty(value) ? null : value;
  }

  private isEmpty(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return true;
    }
    return value === null || value === undefined || value === '';
  }

  private validateNumber(value: unknown, fallback: number): number {
    if (typeof value === 'boolean') {
      return fallback;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
      return fallback;
    }

    return parsed;
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: SortDirectionEnum | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(props.total / props.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface SeachableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
