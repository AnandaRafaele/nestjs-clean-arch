import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields unit tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize errors and validatedData with null', () => {
    // SUT: System Under Test
    const sut = new StubClassValidatorFields();
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync') as unknown as jest.Mock;
    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: {
          isString: 'field must be a string',
        },
      },
    ]);

    const sut = new StubClassValidatorFields();

    expect(sut.validate(null as unknown as object)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toBeNull();
    expect(sut.errors).toStrictEqual({
      field: ['field must be a string'],
    });
  });

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync') as unknown as jest.Mock;
    spyValidateSync.mockReturnValue([]);

    const sut = new StubClassValidatorFields();

    expect(sut.validate({ field: 'value' })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field: 'value' });
    expect(sut.errors).toBeNull();
  });
});
