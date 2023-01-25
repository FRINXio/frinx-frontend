import 'yup';

// Not needed to explicitly define in specific files when TS can infer it
declare module 'yup' {
  // reasoning: https://typescript-eslint.io/rules/consistent-type-definitions/#when-not-to-use-it
  // TS implementation of methods to yup -> https://github.com/jquense/yup/issues/345#issuecomment-537338283
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface ArraySchema<T> {
    unique(errMsg: string, mapper: (a: T) => T): ArraySchema<T>;
  }
  // reasoning: https://typescript-eslint.io/rules/consistent-type-definitions/#when-not-to-use-it
  // TS implementation of methods to yup -> https://github.com/jquense/yup/issues/345#issuecomment-537338283
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface StringSchema<any, any, any> | Reference<unknown> | Lazy<any, any> {
    isLabelValid(message: string): boolean;
  }
}
