import { Router } from 'express';
import { device, zone } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import { asyncHandler, decodeCreateDeviceParams } from '../api.helpers';

export default function postDevice(router: Router): void {
  router.post(
    '/devices',
    asyncHandler(async (req, res) => {
      const { headers, body } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;
      const params = decodeCreateDeviceParams(body);

      const dbZone = await zone.getById(Number(params.zoneId), tenantId);

      if (dbZone == null) {
        throw new BadRequestError('wrong zone');
      }

      await device.create(params);
      res.status(201).end();
    }),
  );
}
