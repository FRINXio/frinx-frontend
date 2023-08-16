/* eslint-disable no-console */
import chalk from 'chalk';
import * as esbuild from 'esbuild';
import executionTime from 'execution-time';
import { oraPromise } from 'ora';
import { makeConfig, PACKAGE_NAME, prepareFiles } from './common.mjs';

const formattedPackageName = chalk.bold(PACKAGE_NAME);

await oraPromise(prepareFiles, {
  text: chalk.yellow(`Preparing ${formattedPackageName} output folder.`),
});

const perf = executionTime();

perf.start();

async function build() {
  await esbuild.build({
    ...makeConfig(true),
    define: { IS_PRODUCTION: 'true' },
  });
  return perf.stop();
}

console.log(chalk.blue(`📦 Started building ${formattedPackageName} package.`));
await oraPromise(build, {
  successText: (result) =>
    chalk.green(`Finished building ${formattedPackageName} package in ${chalk.bold(result.preciseWords)}.`),
  text: chalk.yellow(`Building ${formattedPackageName}.`),
});
