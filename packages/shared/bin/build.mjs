import * as esbuild from 'esbuild';
import path from 'node:path';
import pkg from '../package.json' assert { type: 'json' };

function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

const COMMON_CONFIG = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  write: true,
  minify: false,
  sourcemap: false,
  treeShaking: true,
  format: 'esm',
  external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
};

await esbuild.build({
  ...COMMON_CONFIG,
  outfile: fullPath(pkg.module),
});

await esbuild.build({
  ...COMMON_CONFIG,
  outfile: fullPath(pkg.main),
});
