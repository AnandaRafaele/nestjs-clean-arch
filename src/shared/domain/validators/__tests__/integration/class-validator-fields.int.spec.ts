import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  constructor(data: object) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: object): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('should validate with errors', () => {
    const sut = new StubClassValidatorFields();

    expect(sut.validate(null as unknown as object)).toBeFalsy();
    expect(sut.validatedData).toBeNull();
    expect(sut.errors).toEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a positive number',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('should validate without errors', () => {
    const sut = new StubClassValidatorFields();
    const data = { name: 'value', price: 10 };

    expect(sut.validate(data)).toBeTruthy();
    expect(sut.validatedData).toEqual(new StubRules(data));
    expect(sut.errors).toBeNull();
  });
});
