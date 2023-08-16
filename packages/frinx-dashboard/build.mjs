import * as esbuild from 'esbuild';
import path from 'node:path';
import { copyFile, mkdir, rm } from 'node:fs/promises';

function fullPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

await rm(fullPath('../../build-client'), { recursive: true, force: true });
await mkdir(fullPath('../../build-client/static'), { recursive: true });
await copyFile(fullPath('../../public/index.html'), fullPath('../../build-client/index.html'));
await copyFile(fullPath('../../public/favicon.ico'), fullPath('../../build-client/static/favicon.ico'));
await copyFile(fullPath('../../public/l3vpn-options.js'), fullPath('../../build-client/static/l3vpn-options.js'));
await copyFile(
  fullPath('../../node_modules/@frinxio/gamma/dist/l3vpn-options.js'),
  fullPath('../../build-client/static/l3vpn-options.js'),
);

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  write: true,
  minify: true,
  sourcemap: false,
  splitting: true,
  treeShaking: true,
  format: 'esm',
  define: { IS_PRODUCTION: false },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  outExtension: { '.js': '.mjs' },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  loader: { '.svg': 'file', '.png': 'file', '.woff': 'file', '.woff2': 'file' },
  publicPath: '/static/',
  outdir: fullPath('../../build-client/static'),
});
