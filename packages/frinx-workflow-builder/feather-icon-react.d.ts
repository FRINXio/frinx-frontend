import { FC } from 'react';

declare module 'feather-icons-react' {
  const content: FC<{ icon: string; size: string }>;

  export default content;
}
