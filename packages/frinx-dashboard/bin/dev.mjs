import chalk from 'chalk';
import * as esbuild from 'esbuild';
import { makeConfig, PACKAGE_NAME, prepareFiles } from './common.mjs';

await prepareFiles();

const ctx = await esbuild.context({
  ...makeConfig(false),
  logLevel: 'info',
});

await ctx.watch();

/* eslint-disable no-console */
console.log(chalk.red('Ignore the running dev server, its purpose is only hot reload.'));
// needed for hot reload
await ctx.serve({ port: 8000 });

// eslint-disable-next-line no-console
console.log(`Watching for changes in ${PACKAGE_NAME} package.`);
