declare module '*.svg' {
  const content: string;
  return content;
}

declare type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[P] extends Record<string, any>
    ? RecursivePartial<T[P]>
    : T[P];
};
