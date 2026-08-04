import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { SeachableRepositoryInterface } from '@/shared/domain/repositories/seachable-repository-contracts';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SeachableRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {
    void props;
    throw new Error('Method not implemented.');
  }
}
