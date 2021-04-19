const { join } = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  parserOptions: {
    // we need to link to tsconfig.json with the full-path,
    // otherwise eslint-in-vscode has problems finding it
    project: join(__dirname, 'tsconfig.json'),
  },
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  extends: ['@frinx/eslint-config-typescript'],
};
