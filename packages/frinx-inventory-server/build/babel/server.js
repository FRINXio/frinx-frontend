"use strict";

var _http = require("http");

var _express = _interopRequireDefault(require("express"));

var _getLogger = _interopRequireDefault(require("./get-logger"));

var _config = _interopRequireDefault(require("./config"));

var _api = _interopRequireDefault(require("./api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _getLogger.default)('frinx-inventory-server'); // when an unhandled promise rejection happens, it is better
// to crash the process. that way we will know about it.
// also, this is the way node will behave in the future.

process.on('unhandledRejection', error => {
  log.error('Error: unhandled promise rejection');
  throw error;
});
const app = (0, _express.default)();
app.use(_express.default.json({
  limit: '30mb'
}));
app.use('/', (0, _api.default)());
const server = (0, _http.createServer)(app); // show startup message when server starts

server.on('listening', () => {
  log.info(`
    Server running on host ${_config.default.host}
    Server running on port ${_config.default.port}
  `);
});
server.listen({
  host: _config.default.host,
  port: _config.default.port
}); // when called, the server will stop handling new requests
// and when all existing requests finish it will exit the process

function close() {
  log.info('got signal to shut down, stopping accepting new connections');

  if (server) {
    server.close(() => {
      log.info('all connections closed. exiting.');
      process.exit(0);
    });
  }
} // SIGTERM is the please-shut-down signal sent by docker/kubernetes/kill-command


process.on('SIGTERM', close); // SIGINT is sent when the user presses control-c in the console where node is running

process.on('SIGINT', close);