import { Router } from 'express';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { uninstallDevice } from '../../uniconfig-api';
import { asyncHandler, decodeMountParams, getConnectionType } from '../api.helpers';

export default function postUninstallDevice(router: Router): void {
  router.post(
    '/devices/:id/uninstall',
    asyncHandler(async (req, res) => {
      const { headers, params } = req;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;
      const { id } = params;

      if (id == null || Number.isNaN(Number(id))) {
        throw new BadRequestError('wrong device id');
      }
      const dbDevice = await device.getById(Number(id), tenantId);

      if (dbDevice == null) {
        throw new NotFoundError('device not found');
      }

      const uninstallParams = {
        input: {
          'node-id': dbDevice.name,
          'connection-type': getConnectionType(decodeMountParams(dbDevice.mount_parameters)),
        },
      };

      await uninstallDevice(uninstallParams);

      res.status(201).end();
    }),
  );
}
