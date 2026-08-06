import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { SortDirectionEnum } from '@/shared/domain/repositories/seachable-repository-contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserSearchParams } from '@/users/domain/repositories/user-repository';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../user-in-memory.repository';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  describe('findByEmail method', () => {
    it('should find a user by email', async () => {
      const entity = new UserEntity(userDataBuilder({ email: 'a@mail.com' }));
      await sut.insert(entity);

      const result = await sut.findByEmail(entity.email);

      expect(result.toJSON()).toStrictEqual(entity.toJSON());
    });

    it('should throw NotFoundError when user is not found by email', async () => {
      await expect(sut.findByEmail('missing@mail.com')).rejects.toThrow(
        new NotFoundError('User with email missing@mail.com not found'),
      );
    });
  });

  describe('emailExists method', () => {
    it('should resolve when email does not exist', async () => {
      await expect(sut.emailExists('new@mail.com')).resolves.toBeUndefined();
    });

    it('should throw ConflictError when email already exists', async () => {
      const entity = new UserEntity(userDataBuilder({ email: 'a@mail.com' }));
      await sut.insert(entity);

      await expect(sut.emailExists('a@mail.com')).rejects.toThrow(
        new ConflictError('User email already exists'),
      );
    });
  });

  describe('applyFilter method', () => {
    it('should return all items when filter is null', async () => {
      const items = [
        new UserEntity(userDataBuilder({ name: 'John' })),
        new UserEntity(userDataBuilder({ name: 'Jane' })),
      ];
      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilter'](items, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(result).toStrictEqual(items);
    });

    it('should filter users by name case-insensitively', async () => {
      const items = [
        new UserEntity(userDataBuilder({ name: 'John' })),
        new UserEntity(userDataBuilder({ name: 'JANE' })),
        new UserEntity(userDataBuilder({ name: 'Bob' })),
      ];
      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilter'](items, 'ja');

      expect(spyFilter).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('JANE');
    });
  });

  describe('search method', () => {
    it('should apply filter, sort and pagination', async () => {
      const items = [
        new UserEntity(userDataBuilder({ name: 'test' })),
        new UserEntity(userDataBuilder({ name: 'a' })),
        new UserEntity(userDataBuilder({ name: 'TEST' })),
        new UserEntity(userDataBuilder({ name: 'b' })),
      ];
      sut.items = items;

      const result = await sut.search(
        new UserSearchParams({
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
      expect(result.toJSON().items.map((item: UserEntity) => item.name)).toEqual(['TEST', 'test']);
    });
  });
});
