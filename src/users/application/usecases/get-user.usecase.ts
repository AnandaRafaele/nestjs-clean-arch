import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { UseCase } from '../../../shared/application/usecases/use-case';
import { UserOutput } from '../dtos/user-output';

export type GetUserInput = {
  id: string;
};

export class GetUserUseCase implements UseCase<GetUserInput, UserOutput> {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: GetUserInput): Promise<UserOutput> {
    const user = await this.userRepository.findById(input.id);
    return user.toJSON();
  }
}
