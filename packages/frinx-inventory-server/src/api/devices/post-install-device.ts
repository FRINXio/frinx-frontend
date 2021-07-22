import { Router } from 'express';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { installDevice } from '../../uniconfig-api';
import { asyncHandler, prepareInstallParameters } from '../api.helpers';

export default function postInstallDevice(router: Router): void {
  router.post(
    '/devices/:id/install',
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { mount_parameters } = dbDevice;

      if (mount_parameters == null) {
        throw new BadRequestError('missing mount parameters');
      }

      await installDevice(prepareInstallParameters(dbDevice.name, mount_parameters));

      res.status(201).end();
    }),
  );
}
