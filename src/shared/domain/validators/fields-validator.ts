export type FieldsErrors = {
  [key: string]: string[];
};

export interface FieldsValidatorInterface<PropsValidated> {
  errors: FieldsErrors | null;
  validatedData: PropsValidated | null;
  validate(data: object): boolean;
}
