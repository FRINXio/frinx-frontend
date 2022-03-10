export function omitNullValue<T>(item: T | null | undefined): item is T {
  return !!item;
}
