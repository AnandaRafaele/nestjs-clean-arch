import * as classValidatorImport from 'class-validator';
import { FieldsErrors, FieldsValidatorInterface } from './fields-validator';

type ValidationError = {
  property: string;
  constraints?: Record<string, string>;
};

type ClassValidatorModule = {
  validateSync: (object: object) => ValidationError[];
};

const classValidator = classValidatorImport as unknown as ClassValidatorModule;

export abstract class ClassValidatorFields<
  PropsValidated,
> implements FieldsValidatorInterface<PropsValidated> {
  errors: FieldsErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: object): boolean {
    const errors = classValidator.validateSync(data);

    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints ?? {});
      }
    } else {
      this.validatedData = data as PropsValidated;
    }
    return !errors.length;
  }
}
