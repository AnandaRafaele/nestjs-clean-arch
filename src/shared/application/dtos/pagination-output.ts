import { Entity } from '../../domain/entities/entity';
import { SearchResult } from '../../domain/repositories/seachable-repository-contracts';

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(items: Item[], result: SearchResult<Entity>): PaginationOutput<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}
