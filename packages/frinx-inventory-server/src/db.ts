import { Pool } from 'pg';
import { DBExtendedDevice } from './api.helpers';
import config from './config';

const pool = new Pool({
  connectionString: config.dbURL,
});

export async function getDevices(): Promise<DBExtendedDevice[]> {
  const result = await pool.query<DBExtendedDevice>(
    'SELECT * FROM device_inventory AS d LEFT JOIN ((SELECT uniconfig_zones.id AS zone_id, uniconfig_zones.name AS zone_name, uniconfig_zones.tenant FROM uniconfig_zones) AS z LEFT JOIN (SELECT tenants.id AS tenant_id, tenants.name AS tenant_name FROM tenants) AS t ON z.tenant=t.tenant_id) AS uz ON d.uniconfig_zone=uz.zone_id',
  );
  return result.rows;
}
