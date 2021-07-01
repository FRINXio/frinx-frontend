import { createServer } from 'http';
import express from 'express';
import getLogger from './get-logger';
import config from './config';
import makeAPIHandler from './api';

const log = getLogger('frinx-inventory-server');

// when an unhandled promise rejection happens, it is better
// to crash the process. that way we will know about it.
// also, this is the way node will behave in the future.
process.on('unhandledRejection', (error) => {
  log.error('Error: unhandled promise rejection');
  throw error;
});

const app = express();
app.use(express.json({ limit: '50mb' }));

app.use('/', makeAPIHandler());

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
