import { HashProviderInterface } from '@/shared/application/providers/hash-provider';
import { compare, hash } from 'bcryptjs';

export class BcryptHashProvider implements HashProviderInterface {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }
  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
