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

  it('should return a user name', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toBe(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('should return a user email', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toBe(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('should return a user password', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toBe(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('should return a user createdAt', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBe(props.createdAt);
    expect(sut.createdAt).toBeInstanceOf(Date);
  });
});
