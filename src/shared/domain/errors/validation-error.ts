import { FieldsErrors } from '../validators/fields-validator';

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public Error: FieldsErrors) {
    super('Entity Validation Error');
    this.name = 'Entity Validation Error';
  }
}
