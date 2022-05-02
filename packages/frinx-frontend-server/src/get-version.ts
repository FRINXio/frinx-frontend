import { readFileSync } from 'fs';
import { resolve } from 'path';

export function getVersion(): string {
  return readFileSync(resolve('version'), { encoding: 'utf8' }).trim();
}
