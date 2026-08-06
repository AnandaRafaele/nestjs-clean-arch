import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UpdateUserUseCase } from '../../update-user.usecase';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase(repository);
  });

  it('should throw BadRequestError when id or name is missing', async () => {
    await expect(sut.execute({ id: '', name: 'John' })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    );
    await expect(sut.execute({ id: 'any_id', name: '' })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    );
  });

  it('should throw error when user not found', async () => {
    await expect(sut.execute({ id: 'fake_id', name: 'John' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake_id'),
    );
  });

  it('should update a user name', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new UserEntity(userDataBuilder());
    await repository.insert(entity);

    const output = await sut.execute({ id: entity.id, name: 'new name' });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual(entity.toJSON());
    expect(output.name).toBe('new name');
  });
});
