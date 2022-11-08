import assert from 'assert';
import { readFileSync } from 'fs';

function getPackageVersion(path) {
  const json = JSON.parse(readFileSync(path).toString());
  const { version } = json;
  return version;
}

function main() {
  const dasboardVersion = getPackageVersion('./packages/frinx-dashboard/package.json');
  const frontendServerVersion = getPackageVersion('./packages/frinx-frontend-server/package.json');
  assert.equal(
    dasboardVersion,
    frontendServerVersion,
    `versions in package.json not equal: dashboard = ${dasboardVersion}, frontend-server = ${frontendServerVersion}`,
  );
}

main();
