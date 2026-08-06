import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';
import { UserOutputMapper } from '../../user-output';

describe('UserOutputMapper Unit Tests', () => {
  it('should convert a user in output', () => {
    const entity = new UserEntity(userDataBuilder());

    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
