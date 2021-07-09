import { RequestHandler, Router } from 'express';
import deleteDeviceById from './devices/delete-device-by-id';
import getAllDevices from './devices/get-all-devices';
import getDeviceById from './devices/get-device-by-id';
import postDevice from './devices/post-device';
import deleteZone from './zones/delete-zone-by-id';
import getAllZones from './zones/get-all-zones';
import getZoneById from './zones/get-zone-by-id';
import postZone from './zones/post-zone';

export default function makeAPIHandler(): RequestHandler {
  const router = Router();

  getAllDevices(router);
  getDeviceById(router);
  postDevice(router);
  deleteDeviceById(router);

  getAllZones(router);
  getZoneById(router);
  postZone(router);
  deleteZone(router);

  return router;
}
