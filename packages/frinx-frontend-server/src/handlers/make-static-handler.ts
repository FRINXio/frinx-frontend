import express, { RequestHandler } from 'express';
import path from 'path';
// NOTE: this proxy-handler could in theory go into
// dev-only and do some dev-only magic here
import { createProxyMiddleware } from 'http-proxy-middleware';
import isDev from '../is-dev';

const isProd = !isDev;

function makeDevProxy() {
  return createProxyMiddleware({
    target: 'http://localhost:2999',
  });
}

const STATIC_OPTIONS = {
  index: false, // we do not send index-html files for directories
  redirect: false, // we do do any add-slash/remove-slash manipulations
};

function makeProdStaticHandler() {
  const router = express.Router();
  router.use(express.static('build-client', STATIC_OPTIONS));

  // if nothing is found it falls back on the next step
  router.use((req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve('build-client/index.html'));
  });

  return router;
}

function makeStaticHandler(): RequestHandler {
  if (isDev) {
    return makeDevProxy();
  }

  if (isProd) {
    return makeProdStaticHandler();
  }

  throw new Error('should never happen');
}

export default makeStaticHandler;
