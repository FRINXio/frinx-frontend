/* eslint-disable no-console */
import chalk from 'chalk';
import * as esbuild from 'esbuild';
import executionTime from 'execution-time';
import { exec } from 'node:child_process';
import path from 'node:path';
import { oraPromise } from 'ora';
import { clean, MAIN_FILE_NAME, makeConfig, MODULE_FILE_NAME, PACKAGE_NAME, TYPEGEN_SCRIPT } from './common.mjs';

const formattedPackageName = chalk.bold(PACKAGE_NAME);

await oraPromise(clean, {
  text: chalk.yellow(`Cleaning ${formattedPackageName} dist folder.`),
});

const perf = executionTime();

perf.start('build');

async function build() {
  await esbuild.build({
    ...makeConfig(true),
    outfile: MODULE_FILE_NAME,
  });
  await esbuild.build({
    ...makeConfig(true),
    outfile: MAIN_FILE_NAME,
  });
  return perf.stop('build');
}

console.log(chalk.blue(`📦 Started building ${formattedPackageName} package.`));
await oraPromise(build, {
  successText: (result) =>
    chalk.green(`Finished building ${formattedPackageName} package in ${chalk.bold(result.preciseWords)}.`),
  text: chalk.yellow(`Building ${formattedPackageName}.`),
});

console.log(chalk.blue('🤖 Started building', formattedPackageName, 'types.'));

perf.start('types');

function buildTypes() {
  return new Promise((resolve, reject) => {
    exec(
      TYPEGEN_SCRIPT,
      {
        cwd: path.resolve(process.cwd()),
      },
      (error) => {
        if (error) {
          return reject(error);
        }
        const typesResult = perf.stop('types');
        return resolve(typesResult);
      },
    );
  });
}

await oraPromise(buildTypes, {
  text: chalk.yellow(`Building ${formattedPackageName} types.`),
  successText: (result) =>
    chalk.green(`Finished building ${formattedPackageName} types in ${chalk.bold(result.preciseWords)}.`),
});
