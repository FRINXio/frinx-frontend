import { Router } from 'express';
import { zone } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { asyncHandler, convertDBExtendedZone } from '../api.helpers';

export default function getZoneById(router: Router): void {
  router.get(
    '/zones/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { headers } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;

      if (Number.isNaN(Number(id))) {
        throw new BadRequestError('invalid zone id');
      }

      const dbZone = await zone.getById(Number(id), tenantId);

      if (dbZone == null) {
        throw new NotFoundError('zone not found');
      }

      res.status(200).json(convertDBExtendedZone(dbZone));
    }),
  );
}
