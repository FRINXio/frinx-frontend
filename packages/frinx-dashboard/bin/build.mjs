import * as esbuild from 'esbuild';
import { fullPath, makeConfig, prepareFiles } from './common.mjs';

await prepareFiles();

await esbuild.build({
  ...makeConfig(true),
  outdir: fullPath('../../build-client/static'),
});
