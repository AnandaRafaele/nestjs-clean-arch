import { UserEntityProps } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '@/users/domain/validators/user.validator';

describe('UserValidator unit tests', () => {
  let sut: UserValidator;
  let props: UserEntityProps;

  beforeEach(() => {
    sut = UserValidatorFactory.create();
    props = userDataBuilder();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should validate with valid data', () => {
    expect(sut.validate(props)).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
    expect(sut.errors).toBeNull();
  });

  describe('name field', () => {
    it('should invalidate empty name', () => {
      expect(sut.validate({ ...props, name: '' })).toBeFalsy();
      expect(sut.errors?.name).toStrictEqual(['name should not be empty']);
    });

    it('should invalidate name longer than 255 characters', () => {
      expect(sut.validate({ ...props, name: 'a'.repeat(256) })).toBeFalsy();
      expect(sut.errors?.name).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate non-string name', () => {
      expect(
        sut.validate({ ...props, name: 10 as unknown as string }),
      ).toBeFalsy();
      expect(sut.errors?.name).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('email field', () => {
    it('should invalidate empty email', () => {
      expect(sut.validate({ ...props, email: '' })).toBeFalsy();
      expect(sut.errors?.email).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);
    });

    it('should invalidate non-string email', () => {
      expect(
        sut.validate({ ...props, email: 10 as unknown as string }),
      ).toBeFalsy();
      expect(sut.errors?.email).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate invalid email format', () => {
      expect(sut.validate({ ...props, email: 'invalid-email' })).toBeFalsy();
      expect(sut.errors?.email).toStrictEqual(['email must be an email']);
    });
  });

  describe('password field', () => {
    it('should invalidate empty password', () => {
      expect(sut.validate({ ...props, password: '' })).toBeFalsy();
      expect(sut.errors?.password).toStrictEqual([
        'password should not be empty',
        'password must be longer than or equal to 8 characters',
      ]);
    });

    it('should invalidate password shorter than 8 characters', () => {
      expect(sut.validate({ ...props, password: '1234567' })).toBeFalsy();
      expect(sut.errors?.password).toStrictEqual([
        'password must be longer than or equal to 8 characters',
      ]);
    });

    it('should invalidate password longer than 100 characters', () => {
      expect(sut.validate({ ...props, password: 'a'.repeat(101) })).toBeFalsy();
      expect(sut.errors?.password).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });

    it('should invalidate non-string password', () => {
      expect(
        sut.validate({ ...props, password: 10 as unknown as string }),
      ).toBeFalsy();
      expect(sut.errors?.password).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
        'password must be longer than or equal to 8 characters',
      ]);
    });
  });

  describe('createdAt field', () => {
    it('should invalidate non-date createdAt', () => {
      expect(
        sut.validate({
          ...props,
          createdAt: 'invalid-date' as unknown as Date,
        }),
      ).toBeFalsy();
      expect(sut.errors?.createdAt).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
