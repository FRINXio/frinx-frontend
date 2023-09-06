import express, { RequestHandler } from 'express';
import config from '../config';

function makeConfigJSHandler(): RequestHandler {
  return (_: unknown, res: express.Response) => {
    res.setHeader('content-type', 'application/javascript');
    res.send(`export const config = ${JSON.stringify(config, null, 2)};`);
  };
}

export default makeConfigJSHandler;
