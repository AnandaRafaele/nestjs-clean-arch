import { SignUpInput } from '../../application/usecases/sign-up.usecase';

export class SignUpDto implements SignUpInput {
  name: string;
  email: string;
  password: string;
}
