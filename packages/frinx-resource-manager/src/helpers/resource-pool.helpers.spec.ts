import { describe, expect, test } from 'vitest';
import { getTotalCapacity } from './resource-pool.helpers';

describe('layouted', () => {
  test('get layouted elements', () => {
    expect(
      getTotalCapacity({
        freeCapacity: '256',
        utilizedCapacity: '12',
      }),
    ).toEqual(268n);
  });
});
