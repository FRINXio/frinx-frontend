import { RequestHandler, Router } from 'express';
import { asyncHandler } from './helpers';

function makeAPIHandler(): RequestHandler {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (_, res) => {
      res.status(200).send({ hello: 'world' });
    }),
  );

  return router;
}

export default makeAPIHandler;
