import * as esbuild from 'esbuild';
import path from 'node:path';
import pkg from './package.json' assert { type: 'json' };

function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  write: true,
  minify: false,
  sourcemap: false,
  treeShaking: true,
  format: 'esm',
  external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
  outfile: fullPath(pkg.module),
});

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  write: true,
  minify: false,
  sourcemap: false,
  treeShaking: true,
  format: 'cjs',
  external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
  outfile: fullPath(pkg.main),
});
