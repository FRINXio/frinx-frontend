export function omitNullValue<T>(item: T | null): item is T {
  if (item === null) {
    return false;
  }

  return true;
}
