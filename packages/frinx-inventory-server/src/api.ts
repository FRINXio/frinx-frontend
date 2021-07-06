import { RequestHandler, Router } from 'express';
import { convertDBExtendedDevice } from './api.helpers';
import { getDevices } from './db';
import { asyncHandler } from './helpers';

function makeAPIHandler(): RequestHandler {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (_, res) => {
      res.status(200).send({ hello: 'world' });
    }),
  );

  router.get(
    '/devices',
    asyncHandler(async (_, res) => {
      const dbDevices = await getDevices();
      const devices = dbDevices.map(convertDBExtendedDevice);
      res.status(200).json(devices);
    }),
  );

  return router;
}

export default makeAPIHandler;
