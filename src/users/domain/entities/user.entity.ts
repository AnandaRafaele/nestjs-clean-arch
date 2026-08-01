export interface UserEntityProps {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export class UserEntity {
  constructor(public readonly props: UserEntityProps) {
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get getUserProps() {
    return this.props.name;
  }
}
