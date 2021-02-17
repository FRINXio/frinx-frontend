module.exports = (api) => {
  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/flow'],
    plugins: [
      [
        'relay',
        {
          schema: './data/schema.graphql',
        },
      ],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
    ],
  };
};
