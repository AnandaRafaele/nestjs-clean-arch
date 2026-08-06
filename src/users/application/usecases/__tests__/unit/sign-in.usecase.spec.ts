import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { SignInUseCase } from '../../sign-in.usecase';

describe('SignInUseCase unit tests', () => {
  let sut: SignInUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: jest.Mocked<HashProviderInterface>;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = {
      generateHash: jest.fn().mockResolvedValue('hashed_password'),
      compareHash: jest.fn().mockResolvedValue(true),
    };
    sut = new SignInUseCase(repository, hashProvider);
  });

  it('should throw BadRequestError when email or password is missing', async () => {
    await expect(sut.execute({ email: '', password: '12345678' })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    );
    await expect(sut.execute({ email: 'a@mail.com', password: '' })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    );

    expect(hashProvider.compareHash.mock.calls).toHaveLength(0);
  });

  it('should throw error when user not found by email', async () => {
    await expect(sut.execute({ email: 'missing@mail.com', password: '12345678' })).rejects.toThrow(
      new NotFoundError('User with email missing@mail.com not found'),
    );
  });

  it('should throw InvalidCredentialsError when password does not match', async () => {
    const entity = new UserEntity(userDataBuilder({ password: 'hashed_password' }));
    await repository.insert(entity);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(sut.execute({ email: entity.email, password: 'wrong_password' })).rejects.toThrow(
      new InvalidCredentialsError('Invalid credentials'),
    );

    expect(hashProvider.compareHash.mock.calls).toEqual([['wrong_password', entity.password]]);
  });

  it('should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const entity = new UserEntity(userDataBuilder({ password: 'hashed_password' }));
    await repository.insert(entity);

    const output = await sut.execute({
      email: entity.email,
      password: '12345678',
    });

    expect(spyFindByEmail).toHaveBeenCalledWith(entity.email);
    expect(hashProvider.compareHash.mock.calls).toEqual([['12345678', entity.password]]);
    expect(output).toStrictEqual(entity.toJSON());
  });
});
