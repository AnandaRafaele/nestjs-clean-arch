import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { UserOutput } from './dtos/user-output';

export type GetUserInput = {
  id: string;
};

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: GetUserInput): Promise<UserOutput> {
    const user = await this.userRepository.findById(input.id);
    return user.toJSON();
  }
}
