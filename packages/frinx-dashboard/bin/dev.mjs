import * as esbuild from 'esbuild';
import { fullPath, makeConfig, prepareFiles } from './common.mjs';

await prepareFiles();

const ctx = await esbuild.context({
  ...makeConfig(false),
  define: { IS_PRODUCTION: 'false' },
  outdir: fullPath('../../build-client/static'),
});

await ctx.watch();
// needed for hot reload
await ctx.serve({ port: 8000 });

// eslint-disable-next-line no-console
console.log('Watching for changes...');
