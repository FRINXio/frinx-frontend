import { describe, expect, test } from 'vitest';
import { readFileSync } from 'fs';
import { getLayoutedElements } from './layout.helpers';

function loadElements(fileName: string) {
  return JSON.parse(readFileSync(`./packages/frinx-workflow-builder/src/helpers/workflows/${fileName}`).toString());
}

describe('layouted', () => {
  test('get layouted elements', () => {
    const layoutedRaw = loadElements('layouted_raw.json');
    const layoutedOutput = loadElements('layouted_output.json');

    expect(getLayoutedElements(layoutedRaw)).toEqual(layoutedOutput);
  });
});
