const { join } = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: ['@frinx/eslint-config-typescript'],
  parserOptions: {
    project: join(__dirname, 'tsconfig.json'),
  },
  env: {
    browser: true,
  },
  settings: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'import/resolver': {
      typescript: {},
    },
  },
};
