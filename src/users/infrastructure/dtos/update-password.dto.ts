import { UpdatePasswordInput } from '../../application/usecases/update-password.usecase';

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  newPassword: string;
  oldPassword: string;
}
