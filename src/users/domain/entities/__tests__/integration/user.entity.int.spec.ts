import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity, UserEntityProps } from '@/users/domain/entities/user.entity';
import { userDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('should throw an EntityValidationError when name is invalid', () => {
      let props: UserEntityProps = {
        ...userDataBuilder(),
        name: '',
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        name: 'a'.repeat(256),
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        name: 10 as unknown as string,
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an EntityValidationError when email is invalid', () => {
      let props: UserEntityProps = {
        ...userDataBuilder(),
        email: '',
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        email: 'a'.repeat(256),
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        email: 10 as unknown as string,
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an EntityValidationError when password is invalid', () => {
      let props: UserEntityProps = {
        ...userDataBuilder(),
        password: '',
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        password: 'a'.repeat(7),
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        password: 'a'.repeat(101),
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder(),
        password: 10 as unknown as string,
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an EntityValidationError when createdAt is invalid', () => {
      const props: UserEntityProps = {
        ...userDataBuilder(),
        createdAt: '2023' as unknown as Date,
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should create a valid user', () => {
      const props: UserEntityProps = userDataBuilder();
      const entity = new UserEntity(props);

      expect(entity.props.name).toBe(props.name);
      expect(entity.props.email).toBe(props.email);
      expect(entity.props.password).toBe(props.password);
      expect(entity.props.createdAt).toBeInstanceOf(Date);
      expect(entity.id).toBeDefined();
    });
  });

  describe('Update methods', () => {
    it('should throw an error when updating name with invalid data', () => {
      const entity = new UserEntity(userDataBuilder());

      expect(() => entity.updateName('')).toThrow(EntityValidationError);
      expect(() => entity.updateName('a'.repeat(256))).toThrow(EntityValidationError);
      expect(() => entity.updateName(10 as unknown as string)).toThrow(EntityValidationError);
    });

    it('should update a valid name', () => {
      const entity = new UserEntity(userDataBuilder());
      entity.updateName('new name');
      expect(entity.name).toBe('new name');
    });

    it('should throw an error when updating password with invalid data', () => {
      const entity = new UserEntity(userDataBuilder());

      expect(() => entity.updatePassword('')).toThrow(EntityValidationError);
      expect(() => entity.updatePassword('a'.repeat(7))).toThrow(EntityValidationError);
      expect(() => entity.updatePassword('a'.repeat(101))).toThrow(EntityValidationError);
      expect(() => entity.updatePassword(10 as unknown as string)).toThrow(EntityValidationError);
    });

    it('should update a valid password', () => {
      const entity = new UserEntity(userDataBuilder());
      entity.updatePassword('new password');
      expect(entity.password).toBe('new password');
    });
  });
});
