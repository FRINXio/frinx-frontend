/* eslint-disable no-console */
import chalk from 'chalk';
import * as esbuild from 'esbuild';
import executionTime from 'execution-time';
import { exec } from 'node:child_process';
import path from 'node:path';
import { oraPromise } from 'ora';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { clean, makeConfig } from './common.mjs';

export class Builder {
  constructor(options) {
    this.formattedPackageName = chalk.bold(options.packageName);
    this.perf = executionTime();
  }

  clean() {
    return oraPromise(clean, {
      text: chalk.yellow(`Cleaning ${this.formattedPackageName} dist folder.`),
    });
  }

  buildPackage(options) {
    const build = async () => {
      this.perf.start('build');
      await esbuild.build({
        ...makeConfig({ isProd: true, external: options.external ?? [] }),
        outfile: options.mainFileName,
      });
      await esbuild.build({
        ...makeConfig({ isProd: true, external: options.external ?? [] }),
        outfile: options.moduleFileName,
      });
      return this.perf.stop('build');
    };
    console.log(chalk.blue(`📦 Started building ${this.formattedPackageName} package.`));
    return oraPromise(build, {
      successText: (result) =>
        chalk.green(`Finished building ${this.formattedPackageName} package in ${chalk.bold(result.preciseWords)}.`),
      text: chalk.yellow(`Building ${this.formattedPackageName}.`),
    });
  }

  buildTypes(script) {
    this.perf.start('types');

    const buildTypes = async () => {
      return new Promise((resolve, reject) => {
        exec(
          script,
          {
            cwd: path.resolve(process.cwd()),
          },
          (error) => {
            if (error) {
              return reject(error);
            }
            const typesResult = this.perf.stop('types');
            return resolve(typesResult);
          },
        );
      });
    };

    console.log(chalk.blue('🤖 Started building', this.formattedPackageName, 'types.'));
    return oraPromise(buildTypes, {
      text: chalk.yellow(`Building ${this.formattedPackageName} types.`),
      successText: (result) =>
        chalk.green(`Finished building ${this.formattedPackageName} types in ${chalk.bold(result.preciseWords)}.`),
    });
  }
}

export async function makeContextAndWatch(options) {
  const ctx = await esbuild.context({
    ...makeConfig({ isProd: false, external: options.external ?? [] }),
    outfile: options.moduleFileName,
    logLevel: 'info',
    plugins: [dtsPlugin()],
  });

  await ctx.watch();

  console.log(`Watching for changes in ${options.packageName} package.`);
}
