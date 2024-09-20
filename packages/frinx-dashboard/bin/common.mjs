import path from 'node:path';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import pkg from '../package.json' assert { type: 'json' };

export function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

const BUILD_CLIENT_PATH = '../../build-client';

export async function prepareFiles() {
  await rm(BUILD_CLIENT_PATH, { recursive: true, force: true });
  await mkdir(fullPath(BUILD_CLIENT_PATH, 'static'), { recursive: true });
  await copyFile(fullPath('../../public/index.html'), fullPath(BUILD_CLIENT_PATH, 'index.html'));
  await copyFile(fullPath('../../public/favicon.ico'), fullPath(BUILD_CLIENT_PATH, 'static/favicon.ico'));
}

export function makeConfig(isProd) {
  return {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    splitting: true,
    treeShaking: true,
    format: 'esm',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    outExtension: { '.js': '.mjs' },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    loader: { '.svg': 'file', '.png': 'file', '.woff': 'file', '.woff2': 'file' },
    publicPath: '/static/',
    outdir: fullPath(BUILD_CLIENT_PATH, 'static'),
  };
}

export const PACKAGE_NAME = pkg.name;
