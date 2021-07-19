import { Router } from 'express';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { asyncHandler, convertEditDeviceParams, decodeEditDeviceParams } from '../api.helpers';

export default function editDeviceById(router: Router): void {
  router.put(
    '/devices/:id',
    asyncHandler(async (req, res) => {
      const { headers, params, body } = req;
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

      const decodedParams = decodeEditDeviceParams(body);
      const editDeviceParams = convertEditDeviceParams(decodedParams, dbDevice);

      await device.updateById(Number(id), editDeviceParams);

      res.status(204).end();
    }),
  );
}
