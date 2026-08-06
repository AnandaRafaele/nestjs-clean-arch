import { UseCase } from '@/shared/application/usecases/use-case';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';

export type DeleteUserInput = {
  id: string;
};

export class DeleteUserUseCase implements UseCase<DeleteUserInput, void> {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: DeleteUserInput): Promise<void> {
    await this.userRepository.delete(input.id);
  }
}
