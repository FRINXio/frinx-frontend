import { Builder } from '@frinx/build-scripts';
import pkg from '../package.json' assert { type: 'json' };

const builder = new Builder({ packageName: pkg.name });

await builder.clean();
await builder.buildPackage({
  mainFileName: pkg.main,
  moduleFileName: pkg.module,
});
await builder.buildTypes(pkg.scripts.typegen);
