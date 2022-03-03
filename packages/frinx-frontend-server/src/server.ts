import express from 'express';
import { createServer } from 'http';
import getLogger from './get-logger';
import makeConfigJSHandler from './handlers/make-config-js-handler';
import makeStaticHandler from './handlers/make-static-handler';

// when an unhandled promise rejection happens, it is better
// to crash the process. that way we will know about it.
// also, this is the way node will behave in the future.
process.on('unhandledRejection', (error) => {
  console.error('Error: unhandled promise rejection'); // eslint-disable-line no-console
  throw error;
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = process.env.HOST || '127.0.0.1';

export const log = getLogger('frinx-frontend-server');

const app = express();

app.use('/-/config.js', makeConfigJSHandler());
app.use('/-*', (req, res) => {
  res.sendStatus(404);
});
app.get('/*', makeStaticHandler());

const server = createServer(app);

server.on('listening', () => {
  log.info(`Server running on ${HOST}:${PORT} (use [env.IP] [env.PORT] to change)`);
});

server.listen(PORT, HOST);

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
