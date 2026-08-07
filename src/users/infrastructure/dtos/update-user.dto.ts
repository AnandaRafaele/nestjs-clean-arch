import { UpdateUserInput } from '../../application/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  name: string;
}
