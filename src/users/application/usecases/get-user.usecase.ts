import { NotFoundError } from '../../../shared/domain/errors/not-found-error';
import { UserRepositoryInterface } from '../../domain/repositories/user-repository';
import { UserOutput } from './dtos/user-output';

export type GetUserInput = {
  id: string;
};

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: GetUserInput): Promise<UserOutput> {
    const { id } = input;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.toJSON();
  }
}
