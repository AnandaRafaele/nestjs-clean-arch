import { faker } from '@faker-js/faker';
import { UserEntityProps } from '@/users/domain/entities/user.entity';

export const userDataBuilder = (
  props: Partial<UserEntityProps> = {},
): UserEntityProps => {
  return {
    name: props.name ?? faker.person.fullName({ sex: 'female' }),
    email: props.email ?? faker.internet.email({ firstName: 'Jane' }),
    password: props.password ?? faker.internet.password({ length: 10 }),
    createdAt: props.createdAt ?? new Date(),
  };
};
