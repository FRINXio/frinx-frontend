module.exports = api => {
  const plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ];

  if (api.env('development')) {
    api.cache(true);
  } else {
    api.cache(false);
  }

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: ['last 4 chrome versions', 'last 4 firefox versions'],
          },
        },
      ],
      '@babel/preset-react',
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
        },
      ],
    ],
    comments: true,
    plugins,
  };
};
