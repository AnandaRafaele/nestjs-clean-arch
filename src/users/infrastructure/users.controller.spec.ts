import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { GetUserUseCase } from '../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../application/usecases/list-users.usecase';
import { SignInUseCase } from '../application/usecases/sign-in.usecase';
import { SignUpUseCase } from '../application/usecases/sign-up.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: SignUpUseCase, useValue: { execute: jest.fn() } },
        { provide: SignInUseCase, useValue: { execute: jest.fn() } },
        { provide: ListUsersUseCase, useValue: { execute: jest.fn() } },
        { provide: GetUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdatePasswordUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteUserUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
