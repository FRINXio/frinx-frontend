import { Pool } from 'pg';
import { DeviceParams } from '../api.helpers';
import { DBDevice, DBExtendedDevice } from './types';

export default class Device {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAll = async (): Promise<DBExtendedDevice[]> => {
    const result = await this.pool.query<DBExtendedDevice>(
      'SELECT * FROM device_inventory AS d LEFT JOIN ((SELECT uniconfig_zones.id AS zone_id, uniconfig_zones.name AS zone_name, uniconfig_zones.tenant FROM uniconfig_zones) AS z LEFT JOIN (SELECT tenants.id AS tenant_id, tenants.name AS tenant_name FROM tenants) AS t ON z.tenant=t.tenant_id) AS uz ON d.uniconfig_zone=uz.zone_id',
    );
    return result.rows;
  };

  getById = async (id: number): Promise<DBExtendedDevice> => {
    const result = await this.pool.query<DBExtendedDevice>(
      'SELECT * FROM device_inventory AS d LEFT JOIN ((SELECT uniconfig_zones.id AS zone_id, uniconfig_zones.name AS zone_name, uniconfig_zones.tenant FROM uniconfig_zones) AS z LEFT JOIN (SELECT tenants.id AS tenant_id, tenants.name AS tenant_name FROM tenants) AS t ON z.tenant=t.tenant_id) AS uz ON d.uniconfig_zone=uz.zone_id WHERE id = $1',
      [id],
    );
    return result.rows[0];
  };

  create = async (params: DeviceParams): Promise<{ id: number }> => {
    const { name, zoneId } = params;
    const mountParameters = params.mountParameters ? JSON.parse(params.mountParameters) : null;
    const result = await this.pool.query<DBDevice>(
      `INSERT INTO device_inventory(id, name, uniconfig_zone, mount_parameters) VALUES(DEFAULT, $1, $2, $3) RETURNING *`,
      [name, Number(zoneId), mountParameters],
    );
    return result.rows[0];
  };

  deleteById = async (id: number): Promise<{ id: number }> => {
    const result = await this.pool.query<DBDevice>('DELETE FROM device_inventory WHERE id = $1', [id]);
    return result.rows[0];
  };
}
