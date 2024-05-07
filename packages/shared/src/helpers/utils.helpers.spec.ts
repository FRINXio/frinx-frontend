import { describe, test, assert } from 'vitest';
import { omitDeep } from './utils.helpers';

const NESTED_OBJECT = {
  a: 'a',
  g: 'g',
  e: {
    f: 'f',
    g: 'g',
    l: {
      m: 'm',
      n: {
        g: 'g',
        s: 's',
        p: {
          g: 'g',
          w: {
            g: 'g',
          },
        },
      },
      g: 'g',
    },
  },
};

const OMITTED_NESTED_OBJECT = {
  a: 'a',
  e: {
    f: 'f',
    l: {
      m: 'm',
      n: {
        s: 's',
        p: {
          w: {},
        },
      },
    },
  },
};

describe('omitDeep function test', () => {
  test('omitDeep', () => {
    assert.deepEqual(omitDeep(NESTED_OBJECT, 'g'), OMITTED_NESTED_OBJECT);
  });
});
