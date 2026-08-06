import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { BadRequestError } from '@/users/errors/bad-request-error';

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
  ) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new BadRequestError('Input data not provided');
    }

    await this.userRepository.emailExists(email);

    const hashedPassword = await this.hashProvider.generateHash(password);
    const entity = new UserEntity({
      ...input,
      password: hashedPassword,
    });

    await this.userRepository.insert(entity);

    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt as Date,
    };
  }
}
