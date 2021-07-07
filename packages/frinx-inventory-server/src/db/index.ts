import { Pool } from 'pg';
import config from '../config';
import Device from './device';
import Zone from './zone';

const pool = new Pool({
  connectionString: config.dbURL,
});

export const device = new Device(pool);
export const zone = new Zone(pool);
