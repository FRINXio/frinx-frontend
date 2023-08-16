import path from 'node:path';
import { rm } from 'node:fs/promises';
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
    external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
  };
}

export async function clean() {
  await rm(path.resolve('./dist'), { force: true, recursive: true });
}

export const MODULE_FILE_NAME = fullPath(pkg.module);
export const MAIN_FILE_NAME = fullPath(pkg.main);
export const PACKAGE_NAME = pkg.name;
export const TYPEGEN_SCRIPT = pkg.scripts.typegen;
