import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { BadRequestError } from '@/users/errors/bad-request-error';
import { SignUpUseCase } from '../../sign-up.usecase';

describe('SignUpUseCase unit tests', () => {
  let sut: SignUpUseCase;
  let repository: jest.Mocked<Pick<UserRepositoryInterface, 'emailExists' | 'insert'>>;
  let hashProvider: jest.Mocked<HashProviderInterface>;

  beforeEach(() => {
    repository = {
      emailExists: jest.fn().mockResolvedValue(undefined),
      insert: jest.fn().mockResolvedValue(undefined),
    };
    hashProvider = {
      generateHash: jest.fn().mockResolvedValue('hashed_password'),
      compareHash: jest.fn().mockResolvedValue(true),
    };
    sut = new SignUpUseCase(repository as unknown as UserRepositoryInterface, hashProvider);
    jest.spyOn(UserEntity, 'validate').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw BadRequestError when required fields are missing', async () => {
    await expect(
      sut.execute({ name: '', email: 'a@mail.com', password: '12345678' }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));

    expect(repository.emailExists.mock.calls).toHaveLength(0);
    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
    expect(repository.insert.mock.calls).toHaveLength(0);
  });

  it('should throw when email already exists', async () => {
    const props = userDataBuilder();
    repository.emailExists.mockRejectedValue(new ConflictError('User email already exists'));

    await expect(
      sut.execute({
        name: props.name,
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(ConflictError);

    expect(repository.emailExists.mock.calls).toEqual([[props.email]]);
    expect(hashProvider.generateHash.mock.calls).toHaveLength(0);
    expect(repository.insert.mock.calls).toHaveLength(0);
  });

  it('should create a user with hashed password', async () => {
    const props = userDataBuilder();

    const output = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    expect(repository.emailExists.mock.calls).toEqual([[props.email]]);
    expect(hashProvider.generateHash.mock.calls).toEqual([[props.password]]);
    expect(repository.insert.mock.calls).toHaveLength(1);

    const inserted = repository.insert.mock.calls[0][0];
    expect(inserted.password).toBe('hashed_password');

    expect(output.id).toBeDefined();
    expect(typeof output.id).toBe('string');
    expect(output.name).toBe(props.name);
    expect(output.email).toBe(props.email);
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
