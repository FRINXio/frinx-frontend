import 'yup';

// Not needed to explicitly define in specific files when TS can infer it
declare module 'yup' {
  // reasoning: https://typescript-eslint.io/rules/consistent-type-definitions/#when-not-to-use-it
  // TS implementation of methods to yup -> https://github.com/jquense/yup/issues/345#issuecomment-537338283
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface ArraySchema<T> {
    unique(errMsg: string, mapper: (a: T) => T): ArraySchema<T>;
  }
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.inline.svg' {
  const content: 'svg';
  export default content;
}

declare module 'react-notifications';

declare module 'feather-icons-react' {
  const content: FC<{ icon: string; size: string | number }>;

  export default content;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let __webpack_public_path__: string;

declare module 'diff-arrays-of-objects' {
  function diff<T>(
    first: T[],
    second: T[],
    idField?: string,
  ): {
    same: T[];
    added: T[];
    updated: T[];
    removed: T[];
  };
  export default diff;
}
