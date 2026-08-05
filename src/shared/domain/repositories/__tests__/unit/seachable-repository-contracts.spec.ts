import { Entity } from '@/shared/domain/entities/entity';
import {
  SearchParams,
  SearchProps,
  SearchResult,
  SortDirectionEnum,
} from '@/shared/domain/repositories/seachable-repository-contracts';

type StubEntityProps = {
  name: string;
};

class StubEntity extends Entity<StubEntityProps> {}

type PageTestCase = {
  page: unknown;
  expected: number;
};

type PerPageTestCase = {
  perPage: unknown;
  expected: number;
};

type SortTestCase = {
  sort: unknown;
  expected: string | null;
};

type SortDirTestCase = {
  sort?: string | null;
  sortDir: unknown;
  expected: SortDirectionEnum | null;
};

type FilterTestCase = {
  filter: unknown;
  expected: unknown;
};

type LastPageTestCase = {
  total: number;
  perPage: number;
  expected: number;
};

describe('SearchableRepositoryContracts unit tests', () => {
  describe('SearchParams tests', () => {
    it.each<PageTestCase>([
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 'test', expected: 1 },
      { page: true, expected: 1 },
      { page: 1, expected: 1 },
      { page: 5, expected: 5 },
    ])('page prop: $page → $expected', ({ page, expected }) => {
      const params = new SearchParams({ page } as SearchProps);
      expect(params.page).toBe(expected);
    });

    it.each<PerPageTestCase>([
      { perPage: null, expected: 15 },
      { perPage: undefined, expected: 15 },
      { perPage: '', expected: 15 },
      { perPage: 0, expected: 15 },
      { perPage: -1, expected: 15 },
      { perPage: 5.5, expected: 15 },
      { perPage: false, expected: 15 },
      { perPage: {}, expected: 15 },
      { perPage: 'test', expected: 15 },
      { perPage: true, expected: 15 },
      { perPage: 1, expected: 1 },
      { perPage: 5, expected: 5 },
    ])('perPage prop: $perPage → $expected', ({ perPage, expected }) => {
      const params = new SearchParams({ perPage } as SearchProps);
      expect(params.perPage).toBe(expected);
    });

    it.each<SortTestCase>([
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: false, expected: null },
      { sort: true, expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'name', expected: 'name' },
    ])('sort prop: $sort → $expected', ({ sort, expected }) => {
      const params = new SearchParams({ sort } as SearchProps);
      expect(params.sort).toBe(expected);
    });

    it.each<SortDirTestCase>([
      { sortDir: null, expected: null },
      { sortDir: undefined, expected: null },
      { sortDir: 'asc', expected: null },
      { sortDir: 'desc', expected: null },
      { sort: 'name', sortDir: null, expected: SortDirectionEnum.DESC },
      { sort: 'name', sortDir: undefined, expected: SortDirectionEnum.DESC },
      { sort: 'name', sortDir: '', expected: SortDirectionEnum.DESC },
      { sort: 'name', sortDir: 'asc', expected: SortDirectionEnum.ASC },
      { sort: 'name', sortDir: 'ASC', expected: SortDirectionEnum.ASC },
      { sort: 'name', sortDir: 'desc', expected: SortDirectionEnum.DESC },
      { sort: 'name', sortDir: 'DESC', expected: SortDirectionEnum.DESC },
      { sort: 'name', sortDir: 'invalid', expected: SortDirectionEnum.DESC },
    ])('sortDir prop: sort=$sort sortDir=$sortDir → $expected', ({ sort, sortDir, expected }) => {
      const params = new SearchParams({ sort, sortDir } as SearchProps);
      expect(params.sortDir).toBe(expected);
    });

    it.each<FilterTestCase>([
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: false, expected: null },
      { filter: true, expected: null },
      { filter: 0, expected: 0 },
      { filter: -1, expected: -1 },
      { filter: 5.5, expected: 5.5 },
      { filter: 'john', expected: 'john' },
    ])('filter prop: $filter → $expected', ({ filter, expected }) => {
      const params = new SearchParams({ filter } as SearchProps);
      expect(params.filter).toBe(expected);
    });

    it('should use default values when props are omitted', () => {
      const params = new SearchParams();
      expect(params.page).toBe(1);
      expect(params.perPage).toBe(15);
      expect(params.sort).toBeNull();
      expect(params.sortDir).toBeNull();
      expect(params.filter).toBeNull();
    });
  });

  describe('SearchResult tests', () => {
    it('should construct SearchResult and serialize with toJSON', () => {
      const entity1 = new StubEntity({ name: 'teste1' }, '1');
      const entity2 = new StubEntity({ name: 'teste2' }, '2');
      const entity3 = new StubEntity({ name: 'teste3' }, '3');
      const entity4 = new StubEntity({ name: 'teste4' }, '4');

      const sut = new SearchResult({
        items: [entity1, entity2, entity3, entity4],
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: [entity1, entity2, entity3, entity4],
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });
    });

    it('should default optional props to null when omitted', () => {
      const sut = new SearchResult({
        items: [],
        total: 0,
        currentPage: 1,
        perPage: 15,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: [],
        total: 0,
        currentPage: 1,
        perPage: 15,
        lastPage: 0,
        sort: null,
        sortDir: null,
        filter: null,
      });
    });

    it.each<LastPageTestCase>([
      { total: 0, perPage: 15, expected: 0 },
      { total: 4, perPage: 2, expected: 2 },
      { total: 5, perPage: 2, expected: 3 },
      { total: 15, perPage: 15, expected: 1 },
    ])('lastPage: total=$total perPage=$perPage → $expected', ({ total, perPage, expected }) => {
      const sut = new SearchResult({
        items: [],
        total,
        currentPage: 1,
        perPage,
      });

      expect(sut.toJSON().lastPage).toBe(expected);
    });

    it('should serialize entities when forceEntity is true', () => {
      const entity = new StubEntity({ name: 'john' }, 'abc');

      const sut = new SearchResult({
        items: [entity],
        total: 1,
        currentPage: 1,
        perPage: 15,
        sort: 'name',
        sortDir: SortDirectionEnum.ASC,
        filter: 'john',
      });

      expect(sut.toJSON(true)).toStrictEqual({
        items: [{ id: 'abc', name: 'john' }],
        total: 1,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
        sort: 'name',
        sortDir: SortDirectionEnum.ASC,
        filter: 'john',
      });
    });
  });
});
