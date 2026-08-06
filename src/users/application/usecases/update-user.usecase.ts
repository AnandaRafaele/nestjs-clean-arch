import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export type UpdateUserInput = {
  id: string;
  name: string;
};

export class UpdateUserUseCase implements UseCase<UpdateUserInput, UserOutput> {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: UpdateUserInput): Promise<UserOutput> {
    if (!input.id || !input.name) {
      throw new BadRequestError('Input data not provided');
    }

    const user = await this.userRepository.findById(input.id);
    user.updateName(input.name);
    await this.userRepository.update(user);

    return UserOutputMapper.toOutput(user);
  }
}
