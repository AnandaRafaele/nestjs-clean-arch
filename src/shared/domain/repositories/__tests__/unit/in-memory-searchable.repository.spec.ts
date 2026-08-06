import { Entity } from '@/shared/domain/entities/entity';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import {
  SearchParams,
  SortDirectionEnum,
} from '@/shared/domain/repositories/seachable-repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name', 'price'];

  protected applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
    if (!filter) {
      return Promise.resolve(items);
    }

    return Promise.resolve(
      items.filter(item => item.props.name.toLowerCase().includes(filter.toLowerCase())),
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    let items: StubEntity[];

    beforeEach(() => {
      items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'TEST', price: 2 }),
        new StubEntity({ name: 'fake', price: 3 }),
      ];
    });

    it('should return all items when filter is null', async () => {
      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilter'](items, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(result).toStrictEqual(items);
    });

    it('should filter items by name case-insensitively', async () => {
      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilter'](items, 'TEST');

      expect(spyFilter).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result.map(item => item.props.name)).toEqual(['test', 'TEST']);
    });

    it('should return empty list when no item matches filter', async () => {
      const result = await sut['applyFilter'](items, 'no-match');

      expect(result).toHaveLength(0);
    });
  });

  describe('applySort method', () => {
    let items: StubEntity[];

    beforeEach(() => {
      items = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 2 }),
        new StubEntity({ name: 'c', price: 3 }),
      ];
    });

    it('should return original items when sort is null', async () => {
      const result = await sut['applySort'](items, null, null);

      expect(result).toStrictEqual(items);
    });

    it('should return original items when field is not sortable', async () => {
      const result = await sut['applySort'](items, 'invalid', SortDirectionEnum.ASC);

      expect(result).toStrictEqual(items);
    });

    it('should sort items by name ascending', async () => {
      const result = await sut['applySort'](items, 'name', SortDirectionEnum.ASC);

      expect(result.map(item => item.props.name)).toEqual(['a', 'b', 'c']);
    });

    it('should sort items by name descending', async () => {
      const result = await sut['applySort'](items, 'name', SortDirectionEnum.DESC);

      expect(result.map(item => item.props.name)).toEqual(['c', 'b', 'a']);
    });

    it('should not mutate the original items array', async () => {
      const original = [...items];

      await sut['applySort'](items, 'name', SortDirectionEnum.ASC);

      expect(items).toStrictEqual(original);
    });
  });

  describe('applyPagination method', () => {
    let items: StubEntity[];

    beforeEach(() => {
      items = [
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'b', price: 2 }),
        new StubEntity({ name: 'c', price: 3 }),
        new StubEntity({ name: 'd', price: 4 }),
        new StubEntity({ name: 'e', price: 5 }),
      ];
    });

    it('should paginate items', async () => {
      const result = await sut['applyPagination'](items, 1, 2);

      expect(result).toHaveLength(2);
      expect(result.map(item => item.props.name)).toEqual(['a', 'b']);
    });

    it('should paginate items on second page', async () => {
      const result = await sut['applyPagination'](items, 2, 2);

      expect(result.map(item => item.props.name)).toEqual(['c', 'd']);
    });

    it('should return remaining items on last page', async () => {
      const result = await sut['applyPagination'](items, 3, 2);

      expect(result.map(item => item.props.name)).toEqual(['e']);
    });
  });

  describe('search method', () => {
    beforeEach(() => {
      sut.items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'a', price: 2 }),
        new StubEntity({ name: 'TEST', price: 3 }),
        new StubEntity({ name: 'b', price: 4 }),
      ];
    });

    it('should apply filter, sort and pagination', async () => {
      const result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: SortDirectionEnum.ASC,
          filter: 't',
        }),
      );

      expect(result.toJSON()).toMatchObject({
        total: 2,
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        sort: 'name',
        sortDir: SortDirectionEnum.ASC,
        filter: 't',
      });
      expect(result.toJSON().items.map((item: StubEntity) => item.props.name)).toEqual([
        'TEST',
        'test',
      ]);
    });

    it('should search with only pagination when filter and sort are omitted', async () => {
      const result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
        }),
      );

      expect(result.toJSON().items).toHaveLength(2);
      expect(result.toJSON().total).toBe(4);
      expect(result.toJSON().lastPage).toBe(2);
    });
  });
});
