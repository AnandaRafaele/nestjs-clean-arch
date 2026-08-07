import { SortDirectionEnum } from '@/shared/domain/repositories/seachable-repository-contracts';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { GetUserUseCase } from '../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../application/usecases/list-users.usecase';
import { SignInUseCase } from '../application/usecases/sign-in.usecase';
import { SignUpUseCase } from '../application/usecases/sign-up.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UsersController } from './users.controller';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let signUpUseCase: jest.Mocked<Pick<SignUpUseCase, 'execute'>>;
  let signInUseCase: jest.Mocked<Pick<SignInUseCase, 'execute'>>;
  let listUsersUseCase: jest.Mocked<Pick<ListUsersUseCase, 'execute'>>;
  let getUserUseCase: jest.Mocked<Pick<GetUserUseCase, 'execute'>>;
  let updateUserUseCase: jest.Mocked<Pick<UpdateUserUseCase, 'execute'>>;
  let updatePasswordUseCase: jest.Mocked<Pick<UpdatePasswordUseCase, 'execute'>>;
  let deleteUserUseCase: jest.Mocked<Pick<DeleteUserUseCase, 'execute'>>;

  beforeEach(async () => {
    signUpUseCase = { execute: jest.fn() };
    signInUseCase = { execute: jest.fn() };
    listUsersUseCase = { execute: jest.fn() };
    getUserUseCase = { execute: jest.fn() };
    updateUserUseCase = { execute: jest.fn() };
    updatePasswordUseCase = { execute: jest.fn() };
    deleteUserUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: SignUpUseCase, useValue: signUpUseCase },
        { provide: SignInUseCase, useValue: signInUseCase },
        { provide: ListUsersUseCase, useValue: listUsersUseCase },
        { provide: GetUserUseCase, useValue: getUserUseCase },
        { provide: UpdateUserUseCase, useValue: updateUserUseCase },
        { provide: UpdatePasswordUseCase, useValue: updatePasswordUseCase },
        { provide: DeleteUserUseCase, useValue: deleteUserUseCase },
      ],
    }).compile();

    sut = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create method', () => {
    it('should create a user', async () => {
      const props = userDataBuilder();
      const output = {
        id: 'fake_id',
        name: props.name,
        email: props.email,
        createdAt: props.createdAt as Date,
      };
      signUpUseCase.execute.mockResolvedValue(output);

      const result = await sut.create(props);

      expect(signUpUseCase.execute.mock.calls).toEqual([[props]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('login method', () => {
    it('should authenticate a user', async () => {
      const props = userDataBuilder();
      const input = { email: props.email, password: props.password };
      const output = {
        id: 'fake_id',
        name: props.name,
        email: props.email,
        createdAt: props.createdAt as Date,
      };
      signInUseCase.execute.mockResolvedValue(output);

      const result = await sut.login(input);

      expect(signInUseCase.execute.mock.calls).toEqual([[input]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('search method', () => {
    it('should return a paginated list of users', async () => {
      const props = userDataBuilder();
      const output = {
        items: [
          {
            id: 'fake_id',
            name: props.name,
            email: props.email,
            createdAt: props.createdAt as Date,
          },
        ],
        total: 1,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
      };
      const searchParams = {
        page: 1,
        perPage: 15,
        sort: 'name',
        sortDir: SortDirectionEnum.ASC,
        filter: 'test',
      };
      listUsersUseCase.execute.mockResolvedValue(output);

      const result = await sut.search(searchParams);

      expect(listUsersUseCase.execute.mock.calls).toEqual([[searchParams]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('findOne method', () => {
    it('should return a user', async () => {
      const props = userDataBuilder();
      const output = {
        id: 'fake_id',
        name: props.name,
        email: props.email,
        createdAt: props.createdAt as Date,
      };
      getUserUseCase.execute.mockResolvedValue(output);

      const result = await sut.findOne('fake_id');

      expect(getUserUseCase.execute.mock.calls).toEqual([[{ id: 'fake_id' }]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('update method', () => {
    it('should update a user', async () => {
      const props = userDataBuilder();
      const output = {
        id: 'fake_id',
        name: 'new name',
        email: props.email,
        createdAt: props.createdAt as Date,
      };
      updateUserUseCase.execute.mockResolvedValue(output);

      const result = await sut.update('fake_id', { name: 'new name' });

      expect(updateUserUseCase.execute.mock.calls).toEqual([[{ id: 'fake_id', name: 'new name' }]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('updatePassword method', () => {
    it('should update a user password', async () => {
      const props = userDataBuilder();
      const output = {
        id: 'fake_id',
        name: props.name,
        email: props.email,
        createdAt: props.createdAt as Date,
      };
      const body = { oldPassword: 'old_password', newPassword: 'new_password' };
      updatePasswordUseCase.execute.mockResolvedValue(output);

      const result = await sut.updatePassword('fake_id', body);

      expect(updatePasswordUseCase.execute.mock.calls).toEqual([[{ id: 'fake_id', ...body }]]);
      expect(result).toStrictEqual(output);
    });
  });

  describe('remove method', () => {
    it('should delete a user', async () => {
      deleteUserUseCase.execute.mockResolvedValue(undefined);

      await sut.remove('fake_id');

      expect(deleteUserUseCase.execute.mock.calls).toEqual([[{ id: 'fake_id' }]]);
    });
  });
});
