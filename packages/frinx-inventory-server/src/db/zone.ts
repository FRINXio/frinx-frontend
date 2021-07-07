import { Pool } from 'pg';
import { DBExtendedZone, DBTenant, DBUniconfigZone } from './types';
import { ZoneParams } from '../api.helpers';

export default class Zone {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAll = async (): Promise<DBExtendedZone[]> => {
    const result = await this.pool.query<DBExtendedZone>(
      'SELECT * FROM uniconfig_zones AS z LEFT JOIN (SELECT tenants.id AS tenant_id, tenants.name AS tenant_name FROM tenants) AS t ON z.tenant=t.tenant_id',
    );
    return result.rows;
  };

  getById = async (id: number): Promise<DBExtendedZone> => {
    const result = await this.pool.query(
      'SELECT * FROM uniconfig_zones AS z LEFT JOIN (SELECT tenants.id AS tenant_id, tenants.name AS tenant_name FROM tenants) AS t ON z.tenant=t.tenant_id WHERE id = $1',
      [id],
    );
    return result.rows[0];
  };

  create = async (params: ZoneParams): Promise<{ id: number }> => {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { name, tenantName } = params;
      const tenantResult = await client.query<DBTenant>(
        'INSERT INTO tenants(id, name) VALUES(DEFAULT, $1) RETURNING *',
        [tenantName],
      );
      const [{ id: tenantId }] = tenantResult.rows;
      const zoneResult = await client.query<DBUniconfigZone>(
        'INSERT INTO uniconfig_zones(id, name, tenant) VALUES(DEFAULT, $1, $2) RETURNING *',
        [name, tenantId],
      );
      await client.query('COMMIT');
      return zoneResult.rows[0];
    } catch (e) {
      client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  };

  deleteById = async (id: number): Promise<{ id: number }> => {
    const result = await this.pool.query<DBUniconfigZone>('DELETE FROM uniconfig_zones WHERE id = $1', [id]);
    return result.rows[0];
  };
}
