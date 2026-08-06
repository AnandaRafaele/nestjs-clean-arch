import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { GetUserUseCase } from '../../get-user.usecase';

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase(repository);
  });

  it('should throw error when user not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake_id'),
    );
  });

  it('should return a user when user is found', async () => {
    const entity = new UserEntity(userDataBuilder());
    await repository.insert(entity);

    const findByIdSpy = jest.spyOn(repository, 'findById');

    const result = await sut.execute({ id: entity.id });

    expect(result).toStrictEqual(entity.toJSON());
    expect(findByIdSpy).toHaveBeenCalledWith(entity.id);
  });
});
