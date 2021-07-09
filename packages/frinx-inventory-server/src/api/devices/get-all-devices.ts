import { Router } from 'express';
import { asyncHandler, convertDBExtendedDevice } from '../api.helpers';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';

export default function getAllDevices(router: Router): void {
  router.get(
    '/devices',
    asyncHandler(async (req, res) => {
      const { headers } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }

      const tenantId = headers['x-tenant-id'] as string;
      const dbDevices = await device.getAll(tenantId);

      if (dbDevices == null) {
        throw new NotFoundError('devices not found');
      }

      const devices = dbDevices.map(convertDBExtendedDevice);

      res.status(200).json(devices);
    }),
  );
}
