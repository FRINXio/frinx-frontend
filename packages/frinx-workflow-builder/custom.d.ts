import { FC } from 'react';

declare module '*.svg' {
  const content: string;
  return content;
}

declare module 'feather-icons-react' {
  const content: FC<{ icon: string; size: string }>;

  return content;
}
