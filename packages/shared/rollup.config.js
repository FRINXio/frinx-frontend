import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: [Object.keys(pkg.peerDependencies)],
});

export default [
  bundle({
    plugins: [
      external(),
      resolve(),
      commonjs({
        requireReturnsDefault: 'namespace',
      }),
      typescript({ tsconfig: './tsconfig.json' }),
      json(),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        name: 'frinx-api',
        exports: 'auto',
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        exports: 'auto',
      },
    ],
  }),
  bundle({
    output: [{ file: pkg.typings, format: 'esm' }],
    plugins: [dts()],
  }),
];
