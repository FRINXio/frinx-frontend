/* eslint-disable no-console */
import chalk from 'chalk';
import * as esbuild from 'esbuild';
import executionTime from 'execution-time';
import { resolve } from 'node:path';
import { oraPromise } from 'ora';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { clean, makeConfig } from './common.mjs';
import ts from 'typescript';
import { outputFile } from 'fs-extra';

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

  buildTypes(filenames, options) {
    this.perf.start('types');

    const buildTypes = async (filenames, options) => {
      const { moduleResolution, ...rest } = options;
      const host = ts.createCompilerHost(rest);
      host.writeFile = async (filename, contents) => {
        await outputFile(resolve(process.cwd(), filename), contents);
      };

      const program = ts.createProgram(filenames, rest, host);
      program.emit();
      return this.perf.stop('types');
    };

    console.log(chalk.blue('🤖 Started building', this.formattedPackageName, 'types.'));
    return oraPromise(buildTypes.apply(this, [filenames, options]), {
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
