export type FieldsErrors = {
  [key: string]: string[];
};

export interface FieldsValidatorInterface<PropsValidated> {
  errors: FieldsErrors;
  validatedData: PropsValidated;
  validate(data: PropsValidated): void;
}
