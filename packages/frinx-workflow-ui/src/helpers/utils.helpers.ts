export function makeURLSearchParamsFromObject<T extends string | number | string[] | boolean>(
  obj: Record<string, T>,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  const objEntries = Object.entries(obj);

  objEntries.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, val));
    } else {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}

export function makeObjectFromSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const entries = searchParams.entries();
  const obj = Object.fromEntries(entries);

  return obj;
}

// TODO: remove these two functions when we have a better solution -> control if used anywhere else
export const sortAscBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] < y[key]) {
      return -1;
    }
    if (x[key] > y[key]) {
      return 1;
    }
    return 0;
  };
};

export const sortDescBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] > y[key]) {
      return -1;
    }
    if (x[key] < y[key]) {
      return 1;
    }
    return 0;
  };
};

export function flattenObject<T extends object>(obj: T, prefix = ''): Record<string, string | string[]> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix.length > 0 ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value != null) {
      if (Array.isArray(value)) {
        return { ...acc, [fullKey]: value.map((val) => `${val}`) };
      } else {
        return { ...acc, ...flattenObject(value, fullKey) };
      }
    } else {
      return { ...acc, [fullKey]: `${value}` };
    }
  }, {} as Record<string, string | string[]>);
}

export function isValueOfType<T>(propertyName: string, obj?: unknown | null): obj is T {
  if (obj == null) {
    return false;
  }

  return Object.keys(obj).includes(propertyName);
}

export function makeArrayFromValue<T>(value?: T | T[] | null): T[] {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'string') {
    return [value];
  } else {
    return [];
  }
}
