import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UpdatePasswordUseCase } from '../../update-password.usecase';

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: jest.Mocked<HashProviderInterface>;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = {
      generateHash: jest.fn().mockResolvedValue('new_hashed_password'),
      compareHash: jest.fn().mockResolvedValue(true),
    };
    sut = new UpdatePasswordUseCase(repository, hashProvider);
  });

  it('should throw InvalidPasswordError when old or new password is missing', async () => {
    await expect(
      sut.execute({ id: 'any_id', oldPassword: '', newPassword: 'new_password' }),
    ).rejects.toThrow(new InvalidPasswordError('Old password and new password are required'));

    await expect(
      sut.execute({ id: 'any_id', oldPassword: 'old_password', newPassword: '' }),
    ).rejects.toThrow(new InvalidPasswordError('Old password and new password are required'));

    expect(hashProvider.compareHash.mock.calls).toHaveLength(0);
    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
  });

  it('should throw error when user not found', async () => {
    await expect(
      sut.execute({ id: 'fake_id', oldPassword: 'old_password', newPassword: 'new_password' }),
    ).rejects.toThrow(new NotFoundError('Entity not found using ID fake_id'));
  });

  it('should throw InvalidPasswordError when old password does not match', async () => {
    const entity = new UserEntity(userDataBuilder({ password: 'hashed_old_password' }));
    await repository.insert(entity);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(
      sut.execute({
        id: entity.id,
        oldPassword: 'wrong_password',
        newPassword: 'new_password',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password is incorrect'));

    expect(hashProvider.compareHash.mock.calls).toEqual([['wrong_password', entity.password]]);
    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
  });

  it('should update a user password', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new UserEntity(userDataBuilder({ password: 'hashed_old_password' }));
    await repository.insert(entity);

    const output = await sut.execute({
      id: entity.id,
      oldPassword: 'old_password',
      newPassword: 'new_password',
    });

    expect(hashProvider.compareHash.mock.calls).toEqual([['old_password', 'hashed_old_password']]);
    expect(hashProvider.generateHash.mock.calls).toEqual([['new_password']]);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(repository.items[0].password).toBe('new_hashed_password');
    expect(output).toStrictEqual(entity.toJSON());
  });
});
