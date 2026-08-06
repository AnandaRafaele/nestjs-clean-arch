import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export type SignInInput = {
  email: string;
  password: string;
};

export class SignInUseCase implements UseCase<SignInInput, UserOutput> {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
  ) {}

  async execute(input: SignInInput): Promise<UserOutput> {
    const { email, password } = input;

    if (!email || !password) {
      throw new BadRequestError('Input data not provided');
    }

    const user = await this.userRepository.findByEmail(email);

    const hashPasswordMatches = await this.hashProvider.compareHash(password, user.password);
    if (!hashPasswordMatches) {
      throw new InvalidCredentialsError('Invalid credentials');
    }

    return UserOutputMapper.toOutput(user);
  }
}
