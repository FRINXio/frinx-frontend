import unescapeJs from 'unescape-js';
import { format } from 'date-fns';
import { getLocalDateFromUTC } from '@frinx/shared';

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

export function flattenObject<T extends object>(obj: T, prefix = ''): Record<string, string | string[]> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
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
    },
    {} as Record<string, string | string[]>,
  );
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

export function parseBoolean(value?: string | null): boolean {
  if (value === 'true') {
    return true;
  } else {
    return false;
  }
}

export const unescapedJSON = (isEscaped: boolean, data?: Record<string, unknown> | unknown | null) => {
  const jsonString = JSON.stringify(data, null, 2);

  if (jsonString == null) {
    return undefined;
  }

  return isEscaped
    ? jsonString
        .replace(/\\n/g, '\\n')
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, '\\&')
        .replace(/\\r/g, '\\r')
        .replace(/\\t/g, '\\t')
        .replace(/\\b/g, '\\b')
        .replace(/\\f/g, '\\f')
    : unescapeJs(jsonString);
};

export const formatDate = (date: Date | number | undefined | null | string) => {
  if (date == null || date === 0) {
    return '-';
  }

  const utcString = new Date(date).toISOString();
  const localDate = getLocalDateFromUTC(utcString);

  return format(localDate, 'dd/MM/yyyy, k:mm');
};
