export function omitNullValue<T>(item: T | null | undefined): item is T {
  return !!item;
}

export function omitMaybeType<T>(item: T | null | undefined): T | null {
  if (item == null) {
    return null;
  }
  return item;
}

export function omitNullProperties<T extends Record<string, unknown>>(item: T | null | undefined): T | null {
  if (item == null) {
    return null;
  }

  return Object.keys(item).reduce((acc, key) => {
    if (item[key] != null) {
      return {
        ...acc,
        [key]: item[key],
      };
    }
    return acc;
  }, {} as T);
}
