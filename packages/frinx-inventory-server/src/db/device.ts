import { Pool } from 'pg';
import { CreateDeviceParams, DBEditDeviceParams } from '../api/api.helpers';
import { DBDevice, DBExtendedDevice } from './types';

export default class Device {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAll = async (tenantId: string): Promise<DBExtendedDevice[]> => {
    const result = await this.pool.query<DBExtendedDevice>(
      'SELECT * FROM device_inventory AS d LEFT JOIN (SELECT uniconfig_zones.id AS zone_id, uniconfig_zones.name AS zone_name, uniconfig_zones.tenant_id as tenant_id FROM uniconfig_zones) AS z ON d.uniconfig_zone=z.zone_id WHERE tenant_id = $1',
      [tenantId],
    );
    return result.rows;
  };

  getById = async (id: number, tenantId: string): Promise<DBExtendedDevice> => {
    const result = await this.pool.query<DBExtendedDevice>(
      'SELECT * FROM device_inventory AS d LEFT JOIN (SELECT uniconfig_zones.id AS zone_id, uniconfig_zones.name AS zone_name, uniconfig_zones.tenant_id as tenant_id FROM uniconfig_zones) AS z ON d.uniconfig_zone=z.zone_id WHERE id = $1 AND tenant_id = $2',
      [id, tenantId],
    );
    return result.rows[0];
  };

  create = async (params: CreateDeviceParams): Promise<{ id: number }> => {
    const { name, zoneId } = params;
    const mountParameters = params.mountParameters ? JSON.parse(params.mountParameters) : null;
    const result = await this.pool.query<DBDevice>(
      `INSERT INTO device_inventory(id, name, uniconfig_zone, mount_parameters) VALUES(DEFAULT, $1, $2, $3) RETURNING *`,
      [name, Number(zoneId), mountParameters],
    );
    return result.rows[0];
  };

  updateById = async (deviceId: number, params: DBEditDeviceParams): Promise<{ id: number }> => {
    const mountParameters = params.mountParameters ? JSON.parse(params.mountParameters) : null;
    const result = await this.pool.query<DBDevice>(
      'UPDATE device_inventory SET name = $1, mount_parameters = $2 WHERE id = $3',
      [params.name, mountParameters, deviceId],
    );
    return result.rows[0];
  };

  deleteById = async (id: number): Promise<{ id: number }> => {
    const result = await this.pool.query<DBDevice>('DELETE FROM device_inventory WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };
}
