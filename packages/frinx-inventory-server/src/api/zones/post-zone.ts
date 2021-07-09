import { Router } from 'express';
import { zone } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import { asyncHandler, decodeZoneParams } from '../api.helpers';

export default function postZone(router: Router): void {
  router.post(
    '/zones',
    asyncHandler(async (req, res) => {
      const { headers, body } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;

      const params = decodeZoneParams(body);
      await zone.create(params, tenantId);
      res.status(201).end();
    }),
  );
}
