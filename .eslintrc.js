module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:flowtype/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'flowtype',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': 'off',
    'flowtype/no-types-missing-file-annotation': 'off',
  },
};
