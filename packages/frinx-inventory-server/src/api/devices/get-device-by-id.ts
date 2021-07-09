import { Router } from 'express';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { asyncHandler, convertDBExtendedDevice } from '../api.helpers';

export default function getDeviceById(router: Router): void {
  router.get(
    '/devices/:id',
    asyncHandler(async (req, res) => {
      const { headers, params } = req;
      const { id } = params;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;

      if (Number.isNaN(Number(id))) {
        throw new BadRequestError('invalid device id');
      }

      const dbDevice = await device.getById(Number(id), tenantId);

      if (dbDevice == null) {
        throw new NotFoundError('device not found');
      }

      res.status(200).json(convertDBExtendedDevice(dbDevice));
    }),
  );
}
