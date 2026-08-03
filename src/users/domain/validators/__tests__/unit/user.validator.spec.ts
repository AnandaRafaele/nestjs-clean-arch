import { UserValidator } from '@/users/domain/validators/user.validator';

describe('UserValidator unit tests', () => {
  it('should be defined', () => {
    expect(new UserValidator()).toBeDefined();
  });
});
