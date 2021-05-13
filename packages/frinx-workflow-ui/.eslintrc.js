module.exports = {
  root: true,
  extends: ['airbnb', 'plugin:react-hooks/recommended', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  plugins: ['flowtype'],

  /* Every rule here MUST have an argument here. So add a comment with explanation to
     each rule here.
   */
  rules: {
    // this fixes the eslint-problem,
    // where eslint cannot find the
    // definitions of the types
    'flowtype/define-flow-type': 1,

    // Report missing or missed placed @flow annotations
    'flowtype/require-valid-file-annotation': ['error', 'always'],

    // enforce consistent flow type-names
    'flowtype/type-id-match': ['error', '^([A-Z][a-z0-9]*)+$'],

    // Dusan hates this one
    'no-lonely-if': 'off',
    // Gabor hates this one
    'no-else-return': 'off',

    // we do not agree with airbnb on this
    // see this for a discussion: https://github.com/airbnb/javascript/issues/1135
    'import/prefer-default-export': 'off',

    // we need to override this one because when the object-keys
    // are numbers, then airbnb wants them unquoted, and flow
    // wants them quoted. and we cannot change it in flow.
    'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: true }],

    // We have added Storybook .story files [Innovatrics]
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    // paths are treated both as absolute paths, and relative to process.cwd()
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          'test.{js,jsx}', // repos with a single test file
          'test-*.{js,jsx}', // repos with multiple top-level test files
          '**/*.{test,spec}.{js,jsx}', // tests where the extension denotes that it is a test
          '**/jest.config.js', // jest config
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          '**/rollup.config.js', // rollup config
          '**/rollup.config.*.js', // rollup config
          '**/gulpfile.js', // gulp config
          '**/gulpfile.*.js', // gulp config
          '**/Gruntfile{,.js}', // grunt config
          '**/protractor.conf.js', // protractor config
          '**/protractor.conf.*.js', // protractor config
          '**/*.story.{js,jsx}', // Storybook story files - ADDED by Innovatrics
        ],
        optionalDependencies: false,
      },
    ],

    // --------------------------------------------------------------------------
    // Rules under this line are extensions over 'eslint-config-innovatrics'

    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
      },
    ],

    // the airbnb-rules say that a label has to
    // BOTH have an htmlFor attribute, and have
    // the input-element as it's child.
    // we disagree here, for us it is enough
    // if one of the two happens.
    // please note, we have to override the rule-customization,
    // that airbnb did, so we explicitly set the empty-object
    // as the second param. just setting the value to 'error'
    // is not enough.
    'jsx-a11y/label-has-associated-control': ['error', {}],

    // airbnb-config is not ready for flow yet,
    // so we override the sort-order rule
    // so that flow-type-annotations can be first
    'react/sort-comp': [
      'error',
      {
        order: ['type-annotations', 'static-methods', 'lifecycle', 'everything-else', '/^render.+$/', 'render'],
      },
    ],

    // dusan hates this
    'react/destructuring-assignment': 'off',

    // We will not write propTypes anymore, as they will be discontinued at all by Facebook
    'react/prop-types': 'off',
    // We will not write propTypes anymore, as they will be discontinued at all by Facebook
    'react/no-unused-prop-types': 'off',
    // airbnb-config wants this to be turned on, but we don't need it
    // as we take care of optional props our own way
    'react/require-default-props': 'off',
  },
};
