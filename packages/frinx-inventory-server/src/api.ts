import { RequestHandler, Router } from 'express';
import { convertDBExtendedDevice, convertDBExtendedZone, decodeDeviceParams } from './api.helpers';
import { createDevice, getDevices, getZones } from './db';
import { asyncHandler } from './helpers';

function makeAPIHandler(): RequestHandler {
  const router = Router();

  router.get(
    '/devices',
    asyncHandler(async (_, res) => {
      const dbDevices = await getDevices();
      const devices = dbDevices.map(convertDBExtendedDevice);
      res.status(200).json(devices);
    }),
  );

  router.post(
    '/devices',
    asyncHandler(async (req, res) => {
      const params = decodeDeviceParams(req.body);
      await createDevice(params);
      res.status(201).end();
    }),
  );

  router.get(
    '/zones',
    asyncHandler(async (_, res) => {
      const dbZones = await getZones();
      const zones = dbZones.map(convertDBExtendedZone);
      res.status(200).json(zones);
    }),
  );

  return router;
}

export default makeAPIHandler;
