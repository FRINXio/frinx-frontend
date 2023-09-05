import { describe, expect, test } from 'vitest';
import { omitMaybeType, omitNullProperties, omitNullValue } from './omit-null-value';

const UNFILTERED_VALUES_ARRAY = [null, { id: 1, name: 'a' }, null, { id: 2, name: 'b' }, { id: 3, name: 'c' }, null];
const UNFILTERED_VALUES_OBJECT = { id: 1, name: 'a', description: 'test', test: null };

const FILTERED_VALUES_ARRAY = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
];
const FILTERED_VALUES_OBJECT = { id: 1, name: 'a', description: 'test' };

describe('omitNullValues helpers test', () => {
  test('omitNullValue', () => {
    expect(UNFILTERED_VALUES_ARRAY.filter(omitNullValue)).toEqual(FILTERED_VALUES_ARRAY);
  });

  test('omitMaybeType', () => {
    expect(UNFILTERED_VALUES_ARRAY.filter(omitMaybeType)).toEqual(FILTERED_VALUES_ARRAY);
  });

  test('omitNullProperties', () => {
    expect(omitNullProperties(UNFILTERED_VALUES_OBJECT)).toEqual(FILTERED_VALUES_OBJECT);
  });
});
