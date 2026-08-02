import { validate as validateUuid } from 'uuid';
import { Entity } from '../../entity';

type StubEntityProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubEntityProps> {}

describe('Entity unit tests', () => {
  let props: StubEntityProps;

  beforeEach(() => {
    props = {
      prop1: 'prop1',
      prop2: 1,
    };
  });

  it('should set props and id', () => {
    const sut = new StubEntity(props);
    expect(sut.props).toStrictEqual(props);
    expect(sut.id).toBeDefined();
    expect(validateUuid(sut.id)).toBe(true);
  });

  it('should accept a valid uuid', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    const sut = new StubEntity(props, validUuid);
    expect(validateUuid(sut.id)).toBe(true);
    expect(sut.id).toBe(validUuid);
  });

  it('should convert a entity to a JSON object', () => {
    const sut = new StubEntity(props);
    expect(sut.toJSON()).toStrictEqual({
      id: sut.id,
      ...props,
    });
  });
});
