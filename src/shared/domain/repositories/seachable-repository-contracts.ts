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
    this.filter = props.filter;
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

  private set filter(value: Filter | null | undefined) {
    this._filter = this.isEmpty(value) ? null : (value as Filter);
  }

  private isEmpty(value: unknown): boolean {
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

export interface SeachableRepositoryInterface<
  E extends Entity,
  SearchInput = SearchParams,
  SearchOutput = any,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>;
}
