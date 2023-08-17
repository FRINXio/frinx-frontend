import { makeContextAndWatch } from '@frinx/build-scripts';
import pkg from '../package.json' assert { type: 'json' };

await makeContextAndWatch({
  packageName: pkg.name,
  moduleFileName: pkg.module,
});
