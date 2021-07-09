import { Router } from 'express';
import { zone } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { asyncHandler, convertDBExtendedZone } from '../api.helpers';

export default function getAllZones(router: Router): void {
  router.get(
    '/zones',
    asyncHandler(async (req, res) => {
      const { headers } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;
      const dbZones = await zone.getAll(tenantId);

      if (dbZones == null) {
        throw new NotFoundError('zones not found');
      }

      const zones = dbZones.map(convertDBExtendedZone);
      res.status(200).json(zones);
    }),
  );
}
