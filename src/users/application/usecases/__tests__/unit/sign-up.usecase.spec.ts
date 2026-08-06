import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { SignUpUseCase } from '../../sign-up.usecase';

describe('SignUpUseCase unit tests', () => {
  let sut: SignUpUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: jest.Mocked<HashProviderInterface>;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = {
      generateHash: jest.fn().mockResolvedValue('hashed_password'),
      compareHash: jest.fn().mockResolvedValue(true),
    };
    sut = new SignUpUseCase(repository, hashProvider);
  });

  it('should throw BadRequestError when required fields are missing', async () => {
    await expect(
      sut.execute({ name: '', email: 'a@mail.com', password: '12345678' }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));

    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
    expect(repository.items).toHaveLength(0);
  });

  it('should throw when email already exists', async () => {
    const props = userDataBuilder();
    await repository.insert(new UserEntity(props));

    await expect(
      sut.execute({
        name: props.name,
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(new ConflictError('User email already exists'));

    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
    expect(repository.items).toHaveLength(1);
  });

  it('should create a user with hashed password', async () => {
    const props = userDataBuilder();

    const output = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    expect(hashProvider.generateHash.mock.calls).toEqual([[props.password]]);
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].password).toBe('hashed_password');

    expect(output.id).toBeDefined();
    expect(typeof output.id).toBe('string');
    expect(output.name).toBe(props.name);
    expect(output.email).toBe(props.email);
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
