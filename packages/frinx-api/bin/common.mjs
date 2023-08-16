import path from 'node:path';
import pkg from '../package.json' assert { type: 'json' };

function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

export function makeConfig(isProd) {
  return {
    entryPoints: ['src/index.ts'],
    bundle: true,
    write: true,
    minify: isProd,
    sourcemap: !isProd,
    treeShaking: true,
    format: 'esm',
  };
}

export const MODULE_FILE_NAME = fullPath(pkg.module);
export const MAIN_FILE_NAME = fullPath(pkg.main);
