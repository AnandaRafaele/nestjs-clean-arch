import { BcryptHashProvider } from '../../bcrypt-hash-provider';

describe('BcryptHashProvider unit tests', () => {
  let sut: BcryptHashProvider;

  beforeEach(() => {
    sut = new BcryptHashProvider();
  });

  it('should return a hash when payload is provided', async () => {
    const hashed = await sut.generateHash('any_string');

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe('any_string');
  });

  it('should return true when payload matches hash', async () => {
    const hashed = await sut.generateHash('any_string');
    const result = await sut.compareHash('any_string', hashed);

    expect(result).toBe(true);
  });

  it('should return false when payload does not match hash', async () => {
    const hashed = await sut.generateHash('any_string');
    const result = await sut.compareHash('wrong_string', hashed);

    expect(result).toBe(false);
  });
});
