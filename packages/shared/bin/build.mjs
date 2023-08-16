import * as esbuild from 'esbuild';
import { MAIN_FILE_NAME, makeConfig, MODULE_FILE_NAME } from './common.mjs';

await esbuild.build({
  ...makeConfig(true),
  outfile: MODULE_FILE_NAME,
});

await esbuild.build({
  ...makeConfig(true),
  outfile: MAIN_FILE_NAME,
});
