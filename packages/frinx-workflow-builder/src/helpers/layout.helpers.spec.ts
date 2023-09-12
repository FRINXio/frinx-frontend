import { describe, expect, test } from 'vitest';
import { getLayoutedElements } from './layout.helpers';
import { layouted_raw, layouted_output } from './workflows/layouted-elements';

describe('layouted', () => {
  test('get layouted elements', () => {
    expect(getLayoutedElements(layouted_raw)).toEqual(layouted_output);
  });
});
