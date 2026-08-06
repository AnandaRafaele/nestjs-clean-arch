import { UserEntity } from '../../domain/entities/user.entity';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class UserOutputMapper {
  static toOutput(user: UserEntity): UserOutput {
    return user.toJSON();
  }
}
