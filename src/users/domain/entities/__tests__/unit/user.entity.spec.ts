import { faker } from '@faker-js/faker';
import { UserEntity, UserEntityProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let props: UserEntityProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = {
      name: faker.person.fullName({ sex: 'female' }),
      email: faker.internet.email({ firstName: 'Jane' }),
      password: faker.internet.password({ length: 10 }),
    };

    sut = new UserEntity(props);
  });

  it('should create a user', () => {
    expect(sut.props.name).toBe(props.name);
    expect(sut.props.email).toBe(props.email);
    expect(sut.props.password).toBe(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });
});
