import { describe, expect, test } from 'vitest';
import unwrap from './unwrap';

const UNWRAP_OBJECT_NONNULL = {
  a: 1234567890n,
  b: 'string',
  c: true as const,
  d: false,
  e: null,
};

describe('unwrap test', () => {
  test('unwrap object', () => {
    expect(unwrap(UNWRAP_OBJECT_NONNULL)).toEqual(UNWRAP_OBJECT_NONNULL);
  });
  test('unwrap null', () => {
    expect(() => unwrap(null)).toThrowError('value is of type object');
  });
});
