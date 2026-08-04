import { Entity } from '@/shared/domain/entities/entity';
import { RepositoryInterface } from './repository-contracts';

export abstract class InMemoryRepository<
  E extends Entity,
> implements RepositoryInterface<E> {
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<E | null> {
    const entity = this.items.find(item => item.id === `${id}`);
    if (!entity) throw new Error(`Entity not found using ID ${id}`);
    return entity;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    this.items = this.items.map(item => {
      if (item.id === entity.id) return entity;
      return item;
    });
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== `${id}`);
  }
}
