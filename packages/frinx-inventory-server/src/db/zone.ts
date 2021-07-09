import { Pool } from 'pg';
import { DBExtendedZone, DBUniconfigZone } from './types';
import { ZoneParams } from '../api/api.helpers';

export default class Zone {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAll = async (tenantId: string): Promise<DBExtendedZone[]> => {
    const result = await this.pool.query<DBExtendedZone>('SELECT * FROM uniconfig_zones WHERE tenant_id = $1', [
      tenantId,
    ]);
    return result.rows;
  };

  getById = async (id: number, tenantId: string): Promise<DBExtendedZone> => {
    const result = await this.pool.query('SELECT * FROM uniconfig_zones WHERE id = $1 AND tenant_id = $2', [
      id,
      tenantId,
    ]);
    return result.rows[0];
  };

  create = async (params: ZoneParams, tenantId: string): Promise<{ id: number }> => {
    const result = await this.pool.query<DBUniconfigZone>(
      'INSERT INTO uniconfig_zones(name, tenant_id) VALUES($1, $2) RETURNING *',
      [params.name, tenantId],
    );
    return result.rows[0];
  };

  deleteById = async (id: number, tenantId: string): Promise<{ id: number }> => {
    const result = await this.pool.query<DBUniconfigZone>(
      'DELETE FROM uniconfig_zones WHERE id = $1 AND tenant_id = $2 RETURNING *',
      [id, tenantId],
    );
    return result.rows[0];
  };
}
