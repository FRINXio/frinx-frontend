import path from 'node:path';
import { rm } from 'node:fs/promises';

function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

export function makeConfig({ isProd, external }) {
  return {
    entryPoints: ['src/index.ts'],
    bundle: true,
    write: true,
    minify: isProd,
    sourcemap: !isProd,
    treeShaking: true,
    format: 'esm',
    loader: { '.svg': 'file', '.png': 'file', '.woff': 'file', '.woff2': 'file' },
    external,
  };
}

export async function clean() {
  await rm(path.resolve('./dist'), { force: true, recursive: true });
}
