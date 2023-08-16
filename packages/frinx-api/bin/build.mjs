/* eslint-disable no-console */
import chalk from 'chalk';
import * as esbuild from 'esbuild';
import executionTime from 'execution-time';
import { exec } from 'node:child_process';
import { oraPromise } from 'ora';
import path from 'node:path';
import { MAIN_FILE_NAME, makeConfig, MODULE_FILE_NAME, PACKAGE_NAME } from './common.mjs';

const formattedPackageName = chalk.bold(PACKAGE_NAME);

const perf = executionTime();

console.log(chalk.yellow('⚛ Started building', formattedPackageName, 'package.'));

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
}

await oraPromise(build, {
  text: `Building ${formattedPackageName}.`,
});

const buildResult = perf.stop('build');

console.log(
  chalk.green('🏁 Finished building', formattedPackageName, 'in', chalk.bold(`${buildResult.preciseWords}.`)),
);
console.log(chalk.yellow('🚀 Started building', formattedPackageName, 'types.'));

perf.start('types');

function buildTypes() {
  return new Promise((resolve, reject) => {
    exec(
      'tsc --declaration --esModuleInterop true --target ESNext --moduleResolution node --outDir dist src/index.ts',
      {
        cwd: path.resolve(process.cwd()),
      },
      (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      },
    );
  });
}

await oraPromise(buildTypes, {
  text: `Building ${formattedPackageName} types.`,
});

const typesResult = perf.stop('types');

console.log(
  chalk.green('🏁 Finished building', formattedPackageName, 'types in', chalk.bold(`${typesResult.preciseWords}.`)),
);
