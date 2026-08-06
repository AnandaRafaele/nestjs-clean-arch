import { SearchResult } from '../../../../domain/repositories/seachable-repository-contracts';
import { PaginationOutputMapper } from '../../pagination-output';

describe('UserOutputMapper Unit Tests', () => {
  it('should convert a user in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any[],
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDir: null,
      filter: 'fake',
    });

    const sut = PaginationOutputMapper.toOutput(result.items, result);

    expect(sut).toStrictEqual({
      currentPage: 1,
      items: ['fake'],
      lastPage: 1,
      perPage: 10,
      total: 1,
    });
  });
});
