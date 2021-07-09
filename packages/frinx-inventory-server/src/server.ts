import { createServer } from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import getLogger from './get-logger';
import config from './config';
import makeAPIHandler from './api';
import ErrorHandler from './errors/error-handler';
import BaseError from './errors/base-error';

const log = getLogger('frinx-inventory-server');

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  ErrorHandler.handleError(error);
  if (!ErrorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(helmet());
app.use('/', makeAPIHandler());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: BaseError, req: Request, res: Response, _: unknown) => {
  res.status(err.httpCode).send(err.message);
});

const server = createServer(app);

// show startup message when server starts
server.on('listening', () => {
  log.info(`
    Server running on host ${config.host}
    Server running on port ${config.port}
  `);
});

server.listen({
  host: config.host,
  port: config.port,
});

// when called, the server will stop handling new requests
// and when all existing requests finish it will exit the process
function close() {
  log.info('got signal to shut down, stopping accepting new connections');
  if (server) {
    server.close(() => {
      log.info('all connections closed. exiting.');
      process.exit(0);
    });
  }
}

// SIGTERM is the please-shut-down signal sent by docker/kubernetes/kill-command
process.on('SIGTERM', close);

// SIGINT is sent when the user presses control-c in the console where node is running
process.on('SIGINT', close);
