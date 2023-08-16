import * as esbuild from 'esbuild';
import { makeConfig, prepareFiles } from './common.mjs';

await prepareFiles();

await esbuild.build({
  ...makeConfig(true),
  define: { IS_PRODUCTION: 'true' },
});
