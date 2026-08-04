import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemoryRepository } from '../../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('should throw an error when entity not found on findById', async () => {
    await expect(sut.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );
  });

  it('should throw an error when entity not found on update', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 }, 'fake id');
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );
  });

  it('should throw an error when entity not found on delete', async () => {
    await expect(sut.delete('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id'),
    );
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 });
    await sut.insert(entity);
    expect(sut.items.length).toBe(1);
    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 });
    await sut.insert(entity);
    const result = await sut.findById(entity.id);
    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should find all entities', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 });
    await sut.insert(entity);
    const entities = await sut.findAll();
    expect(entities).toHaveLength(1);
    expect(entities).toContain(entity);
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 });
    await sut.insert(entity);
    const updated = new StubEntity({ name: 'new name', price: 2 }, entity.id);
    await sut.update(updated);
    expect(sut.items[0].toJSON()).toStrictEqual(updated.toJSON());
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'name', price: 1 });
    await sut.insert(entity);
    await sut.delete(entity.id);
    expect(sut.items).toHaveLength(0);
  });
});
