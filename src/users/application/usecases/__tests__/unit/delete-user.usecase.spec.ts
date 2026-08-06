import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { DeleteUserUseCase } from '../../delete-user.usecase';

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUserUseCase(repository);
  });

  it('should throw error when user not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake_id'),
    );
  });

  it('should delete a user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new UserEntity(userDataBuilder());
    await repository.insert(entity);

    expect(repository.items).toHaveLength(1);

    await sut.execute({ id: entity.id });

    expect(spyDelete).toHaveBeenCalledWith(entity.id);
    expect(repository.items).toHaveLength(0);
  });
});
