import { SortDirectionEnum } from '@/shared/domain/repositories/seachable-repository-contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserSearchResult } from '@/users/domain/repositories/user-repository';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserOutputMapper } from '../../../dtos/user-output';
import { ListUsersUseCase } from '../../list-users.usecase';

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase(repository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return PaginationOutput from toOutput method', () => {
    const entity = new UserEntity(userDataBuilder());
    const searchResult = new UserSearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: null,
    });

    const spyUserMapper = jest.spyOn(UserOutputMapper, 'toOutput');
    const output = sut['toOutput'](searchResult);

    expect(spyUserMapper).toHaveBeenCalledWith(entity);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    });
  });

  it('should return the users ordered by createdAt', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(userDataBuilder({ createdAt })),
      new UserEntity(userDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) })),
      new UserEntity(userDataBuilder({ createdAt: new Date(createdAt.getTime() + 2) })),
    ];
    repository.items = items;

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('should return the output using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(userDataBuilder({ name: 'a' })),
      new UserEntity(userDataBuilder({ name: 'AA' })),
      new UserEntity(userDataBuilder({ name: 'b' })),
      new UserEntity(userDataBuilder({ name: 'c' })),
    ];
    repository.items = items;

    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortDirectionEnum.ASC,
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[1], items[0]].map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });
  });

  it('should call repository search with SearchParams', async () => {
    const entity = new UserEntity(userDataBuilder());
    repository.items = [entity];

    const spySearch = jest.spyOn(repository, 'search');
    const spyToOutput = jest.spyOn(UserOutputMapper, 'toOutput');

    const output = await sut.execute({});

    expect(spySearch).toHaveBeenCalledTimes(1);
    expect(spyToOutput).toHaveBeenCalledTimes(1);
    expect(output.items).toStrictEqual([entity.toJSON()]);
  });
});
