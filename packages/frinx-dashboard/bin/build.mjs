import * as esbuild from 'esbuild';
import chalk from 'chalk';
import executionTime from 'execution-time';
import { makeConfig, prepareFiles } from './common.mjs';

const perf = executionTime();

console.log(chalk.yellow('🚀 Start building', chalk.bold('@frinx/dashboard'), 'package...'));
perf.start();
await prepareFiles();

await esbuild.build({
  ...makeConfig(true),
  define: { IS_PRODUCTION: 'true' },
});
const result = perf.stop();
console.log(chalk.green('👏 Finished', chalk.bold('@frinx/dashboard'), 'in', result.preciseWords));
