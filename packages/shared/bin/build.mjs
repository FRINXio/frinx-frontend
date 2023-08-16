import * as esbuild from 'esbuild';
import chalk from 'chalk';
import executionTime from 'execution-time';
import { MAIN_FILE_NAME, makeConfig, MODULE_FILE_NAME } from './common.mjs';

const perf = executionTime();

console.log(chalk.yellow('🚀 Start building', chalk.bold('@frinx/shared'), 'package...'));
perf.start();
await esbuild.build({
  ...makeConfig(true),
  outfile: MODULE_FILE_NAME,
});

await esbuild.build({
  ...makeConfig(true),
  outfile: MAIN_FILE_NAME,
});
const result = perf.stop();
console.log(chalk.green('👏 Finished', chalk.bold('@frinx/shared'), 'in', result.preciseWords));
