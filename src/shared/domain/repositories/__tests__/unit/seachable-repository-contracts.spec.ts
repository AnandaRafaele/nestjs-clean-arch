import { SearchParams, SearchProps } from '../../seachable-repository-contracts';

type PageTestCase = {
  page: unknown;
  expected: number;
};

type PerPageTestCase = {
  perPage: unknown;
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
      { page: true, expected: 1 }, // boolean não é número → fallback
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
      { perPage: true, expected: 15 }, // boolean não é número → fallback
      { perPage: 1, expected: 1 },
      { perPage: 5, expected: 5 },
    ])('perPage prop: $perPage → $expected', ({ perPage, expected }) => {
      const params = new SearchParams({ perPage } as SearchProps);
      expect(params.perPage).toBe(expected);
    });

    it('should has props sort default value', () => {
      const searchParams = new SearchParams();
      expect(searchParams.sort).toBeNull();
    });

    it('should has props sortDir default value', () => {
      const searchParams = new SearchParams();
      expect(searchParams.sortDir).toBeNull();
    });

    it('should has props filter default value', () => {
      const searchParams = new SearchParams();
      expect(searchParams.filter).toBeNull();
    });
  });
});
