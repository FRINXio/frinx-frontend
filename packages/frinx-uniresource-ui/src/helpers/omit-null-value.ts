export function omitNullValue<T>(item: T | null | undefined): item is T {
  return !!item;
}

export function omitMaybeType<T>(item: T | null | undefined): T | null {
  if (item == null) {
    return null;
  }
  return item;
}
