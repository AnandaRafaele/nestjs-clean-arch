import {
  UserEntity,
  UserEntityProps,
} from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  let props: UserEntityProps;
  let sut: UserEntity;
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    // Substitui UserEntity.validate por um mock (não roda a validação real)
    validateSpy = jest
      .spyOn(UserEntity, 'validate')
      .mockImplementation(() => undefined);
    props = userDataBuilder();
    sut = new UserEntity(props); // já chama validate 1x no construtor
  });

  afterEach(() => {
    // Remove o spy e restaura o método original da classe
    validateSpy.mockRestore();
  });

  it('should construct a user (constructor)', () => {
    expect(validateSpy).toHaveBeenCalledTimes(1);
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

  it('should update a user name', () => {
    // Zera o histórico de chamadas (ignora a do construtor)
    validateSpy.mockClear();
    sut.updateName('new name');
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(sut.props.name).toBe('new name');
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

  it('should update a user password', () => {
    // Zera o histórico de chamadas (ignora a do construtor)
    validateSpy.mockClear();
    sut.updatePassword('new password');
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(sut.props.password).toBe('new password');
  });

  it('should return a user createdAt', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBe(props.createdAt);
    expect(sut.createdAt).toBeInstanceOf(Date);
  });
});
