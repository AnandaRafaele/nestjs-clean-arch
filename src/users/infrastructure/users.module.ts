import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { Module } from '@nestjs/common';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { GetUserUseCase } from '../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../application/usecases/list-users.usecase';
import { SignInUseCase } from '../application/usecases/sign-in.usecase';
import { SignUpUseCase } from '../application/usecases/sign-up.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/bcrypt-hash-provider';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
    {
      provide: SignUpUseCase,
      useFactory: (userRepository: UserRepositoryInterface, hashProvider: HashProviderInterface) =>
        new SignUpUseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignInUseCase,
      useFactory: (userRepository: UserRepositoryInterface, hashProvider: HashProviderInterface) =>
        new SignInUseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface) => new GetUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: UserRepositoryInterface) => new ListUsersUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface) =>
        new UpdateUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (userRepository: UserRepositoryInterface, hashProvider: HashProviderInterface) =>
        new UpdatePasswordUseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface) =>
        new DeleteUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
