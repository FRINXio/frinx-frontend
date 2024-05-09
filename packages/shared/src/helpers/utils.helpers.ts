import { omit } from 'lodash';

export function omitDeep<T extends Record<string, unknown>>(obj: T | null, key: string[]): Record<string, unknown> {
  if (obj == null) {
    return {} as Pick<T, Exclude<keyof T, string>>;
  }

  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const containsObject = values.some((val) => typeof val === 'object');
  const containsKey = keys.some((k) => key.includes(k));

  if (!containsKey && !containsObject) {
    return obj;
  }

  if (containsKey && !containsObject) {
    return omit(obj, key);
  }

  if (!containsKey && containsObject) {
    return omitDeep(obj, key);
  }

  const objWithoutKey: Record<string, unknown> = omit(obj, key);
  const objWithoutKeyValues = Object.values(objWithoutKey);
  const containsObjectEvenWithoutKey = objWithoutKeyValues.some(
    (val) => typeof val === 'object' && !Array.isArray(val),
  );

  if (!containsObjectEvenWithoutKey) {
    return objWithoutKey;
  }

  return Object.keys(objWithoutKey).reduce((acc, curr) => {
    if (typeof objWithoutKey[curr] === 'object' && !Array.isArray(objWithoutKey[curr])) {
      return { ...acc, [curr]: omitDeep(objWithoutKey[curr] as Record<string, unknown>, key) };
    }

    if (Array.isArray(objWithoutKey[curr])) {
      return {
        ...acc,
        [curr]: (objWithoutKey[curr] as unknown[]).map((val) => omitDeep(val as Record<string, unknown>, key)),
      };
    }

    return { ...acc, [curr]: objWithoutKey[curr] };
  }, {});
}
