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
  import { FC } from 'react';

  const content: FC<{ icon: string; size?: string | number }>;

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
