import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { RepositoryInterface } from './repository-contracts';

export abstract class InMemoryRepository<
  E extends Entity,
> implements RepositoryInterface<E> {
  items: E[] = [];

  insert(entity: E): Promise<void> {
    this.items.push(entity);
    return Promise.resolve();
  }

  findById(id: string): Promise<E> {
    return this._get(id);
  }

  findAll(): Promise<E[]> {
    return Promise.resolve(this.items);
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this._findIndexById(entity.id);
    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this._findIndexById(id);
    this.items.splice(index, 1);
  }

  protected _get(id: string): Promise<E> {
    const entity = this.items.find(item => item.id === id);
    if (!entity) {
      return Promise.reject(
        new NotFoundError(`Entity not found using ID ${id}`),
      );
    }
    return Promise.resolve(entity);
  }

  protected _findIndexById(id: string): number {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new NotFoundError(`Entity not found using ID ${id}`);
    }
    return index;
  }
}
