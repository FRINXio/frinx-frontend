import * as esbuild from 'esbuild';
import { makeConfig, prepareFiles } from './common.mjs';

await prepareFiles();

const ctx = await esbuild.context({
  ...makeConfig(false),
});

await ctx.watch();
// needed for hot reload
await ctx.serve({ port: 8000 });

// eslint-disable-next-line no-console
console.log('Watching for changes in @frinx/dashboard package...');
