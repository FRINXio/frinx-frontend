import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
});

export default [
  bundle({
    plugins: [external(), resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), json()],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        name: 'frinx-api',
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    output: [{ file: pkg.typings, format: 'esm' }],
    plugins: [dts()],
  }),
];
