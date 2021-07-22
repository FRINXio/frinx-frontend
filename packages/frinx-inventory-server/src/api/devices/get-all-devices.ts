import { Router } from 'express';
import { APIDevice, asyncHandler, convertDBExtendedDevice } from '../api.helpers';
import { device } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { getInstalledDevices } from '../../uniconfig-api';

function addDeviceInstallStatus(devices: APIDevice[], deviceIds: string[]): APIDevice[] {
  return devices.map((dev) => {
    const { name, status, ...rest } = dev;
    return {
      name,
      ...rest,
      status: deviceIds.includes(name) ? ('INSTALLED' as const) : ('N/A' as const),
    };
  });
}

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
      const installedDevices = await getInstalledDevices();

      if (dbDevices == null) {
        throw new NotFoundError('devices not found');
      }

      const convertedDevices = dbDevices.map(convertDBExtendedDevice);
      const devices = addDeviceInstallStatus(convertedDevices, installedDevices.output.nodes ?? []);

      res.status(200).json(devices);
    }),
  );
}
