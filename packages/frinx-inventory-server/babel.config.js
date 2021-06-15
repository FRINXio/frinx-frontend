module.exports = (api) => {
  // we cache results when dev, we do not cache otherwise
  api.cache(api.env('development'));

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    comments: true,
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator', '@babel/plugin-proposal-optional-chaining'],
  };
};
