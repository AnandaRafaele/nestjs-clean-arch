import { UserValidator } from '@/users/domain/validators/user.validator';

describe('UserValidator integration tests', () => {
  it('should be defined', () => {
    expect(new UserValidator()).toBeDefined();
  });
});
