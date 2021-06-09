"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pino = _interopRequireDefault(require("pino"));

var _isDev = _interopRequireDefault(require("./is-dev"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const shouldPrettyPrint = _isDev.default;

function getLogger(name) {
  const logger = (0, _pino.default)({
    name,
    base: {},
    prettyPrint: shouldPrettyPrint,
    // pretty-print in dev-mode
    formatters: {
      level: label => ({
        level: label
      }) // show log-level as text, like `"error"`, not as number, like `50`.

    }
  });
  return {
    info: text => {
      logger.info(text);
    },
    error: text => {
      logger.error(text);
    }
  };
}

var _default = getLogger;
exports.default = _default;