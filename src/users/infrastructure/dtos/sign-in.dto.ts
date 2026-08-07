import { SignInInput } from '../../application/usecases/sign-in.usecase';

export class SignInDto implements SignInInput {
  email: string;
  password: string;
}
