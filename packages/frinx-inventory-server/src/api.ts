import { RequestHandler, Router } from 'express';
import { convertDBExtendedDevice, convertDBExtendedZone, decodeDeviceParams, decodeZoneParams } from './api.helpers';
import { device, zone } from './db';
import { asyncHandler } from './helpers';

function makeAPIHandler(): RequestHandler {
  const router = Router();

  router.get(
    '/devices',
    asyncHandler(async (_, res) => {
      const dbDevices = await device.getAll();
      const devices = dbDevices.map(convertDBExtendedDevice);
      res.status(200).json(devices);
    }),
  );

  router.get(
    '/devices/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const dbDevice = await device.getById(Number(id));
      res.status(200).json(convertDBExtendedDevice(dbDevice));
    }),
  );

  router.post(
    '/devices',
    asyncHandler(async (req, res) => {
      const params = decodeDeviceParams(req.body);
      await device.create(params);
      res.status(201).end();
    }),
  );

  router.delete(
    '/devices/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await device.deleteById(Number(id));
      res.status(204).end();
    }),
  );

  router.get(
    '/zones',
    asyncHandler(async (_, res) => {
      const dbZones = await zone.getAll();
      const zones = dbZones.map(convertDBExtendedZone);
      res.status(200).json(zones);
    }),
  );

  router.get(
    '/zones/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const dbZone = await zone.getById(Number(id));
      res.status(200).json(convertDBExtendedZone(dbZone));
    }),
  );

  router.post(
    '/zones',
    asyncHandler(async (req, res) => {
      const params = decodeZoneParams(req.body);
      await zone.create(params);
      res.status(201).end();
    }),
  );

  router.delete(
    '/zones/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await zone.deleteById(Number(id));
      res.status(204).end();
    }),
  );

  return router;
}

export default makeAPIHandler;
