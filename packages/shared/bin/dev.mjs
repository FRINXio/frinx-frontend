import * as esbuild from 'esbuild';
import { makeConfig, MODULE_FILE_NAME } from './common.mjs';

const ctx = await esbuild.context({
  ...makeConfig(false),
  outfile: MODULE_FILE_NAME,
  logLevel: 'info',
});

await ctx.watch();

// eslint-disable-next-line no-console
console.log('Watching for changes in @frinx/shared package.');
