import { describe, expect, test } from 'vitest';
import { omitNullValue } from './omit-null-value';

const UNFILTERED_VALUES_ARRAY = [null, { id: 1, name: 'a' }, null, { id: 2, name: 'b' }, { id: 3, name: 'c' }, null];
const FILTERED_VALUES_ARRAY = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
];

describe('omitNullValues helpers test', () => {
  test('omitNullValue', () => {
    expect(UNFILTERED_VALUES_ARRAY.filter(omitNullValue)).toEqual(FILTERED_VALUES_ARRAY);
  });
});
