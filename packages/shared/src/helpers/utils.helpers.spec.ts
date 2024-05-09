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
        f: 'f',
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
        f: 'f',
        p: {
          w: {},
        },
      },
    },
  },
};

const MULTIPLE_OMITTED_NESTED_OBJECT = {
  a: 'a',
  e: {
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

// INFO: object cannot be nested more in the constants above because of the limitation of the test framework
describe('omitDeep function test', () => {
  test('omitDeep', () => {
    assert.deepEqual(omitDeep(NESTED_OBJECT, ['g']), OMITTED_NESTED_OBJECT);
  });
});

// INFO: object cannot be nested more in the constants above because of the limitation of the test framework
describe('omitDeep function test with multiple obj properties to be omitted', () => {
  test('omitDeep', () => {
    assert.deepEqual(omitDeep(NESTED_OBJECT, ['g', 'f']), MULTIPLE_OMITTED_NESTED_OBJECT);
  });
});
