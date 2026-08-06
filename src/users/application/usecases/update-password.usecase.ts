import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UserRepositoryInterface } from '@/users/domain/repositories/user-repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export type UpdatePasswordInput = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export class UpdatePasswordUseCase implements UseCase<UpdatePasswordInput, UserOutput> {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UserOutput> {
    const { id, oldPassword, newPassword } = input;

    if (!oldPassword || !newPassword) {
      throw new InvalidPasswordError('Old password and new password are required');
    }

    const user = await this.userRepository.findById(id);

    const checkOldPassword = await this.hashProvider.compareHash(oldPassword, user.password);
    if (!checkOldPassword) {
      throw new InvalidPasswordError('Old password is incorrect');
    }

    const hashedNewPassword = await this.hashProvider.generateHash(newPassword);
    user.updatePassword(hashedNewPassword);
    await this.userRepository.update(user);

    return UserOutputMapper.toOutput(user);
  }
}
