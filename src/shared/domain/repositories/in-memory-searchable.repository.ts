import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import {
  SeachableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirectionEnum,
} from '@/shared/domain/repositories/seachable-repository-contracts';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SeachableRepositoryInterface<E, any, any>
{
  sortableFields: string[];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(itemsFiltered, props.sort, props.sortDir);

    const itemsPaginated = await this.applyPagination(itemsSorted, props.page, props.perPage);

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>;

  protected applySort(
    items: E[],
    sort: string | null,
    sortDir: SortDirectionEnum | null,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return Promise.resolve(items);
    }

    return Promise.resolve(
      [...items].sort((a, b) => {
        if (a.props[sort] < b.props[sort]) return sortDir === SortDirectionEnum.ASC ? -1 : 1;
        if (a.props[sort] > b.props[sort]) return sortDir === SortDirectionEnum.ASC ? 1 : -1;

        return 0;
      }),
    );
  }

  protected applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const limit = start + perPage;

    return Promise.resolve(items.slice(start, limit));
  }
}
